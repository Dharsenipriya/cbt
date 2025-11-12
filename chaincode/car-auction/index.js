'use strict';

const { Contract } = require('fabric-contract-api');

class CarAuctionContract extends Contract {

  async createCar(ctx, carId, make, model, owner) {
    if (!carId || !make || !model || !owner) throw new Error('Missing args');
    const car = { id: carId, make, model, owner, isAuction: false, highestBid: 0, highestBidder: '', reservePrice: 0 };
    await ctx.stub.putState(carId, Buffer.from(JSON.stringify(car)));
    return JSON.stringify(car);
  }

  async startAuction(ctx, carId, reserve) {
    const car = await this._getCar(ctx, carId);
    const invoker = this._invoker(ctx);
    if (invoker !== car.owner) throw new Error('Only owner can start');
    car.isAuction = true; car.reservePrice = parseFloat(reserve); car.highestBid = 0; car.highestBidder = '';
    await ctx.stub.putState(carId, Buffer.from(JSON.stringify(car)));
    return JSON.stringify(car);
  }

  async placeBid(ctx, carId, bid) {
    const car = await this._getCar(ctx, carId);
    if (!car.isAuction) throw new Error('Not on auction');
    const amount = parseFloat(bid);
    if (amount <= car.highestBid) throw new Error('Bid too low');
    car.highestBid = amount; car.highestBidder = this._invoker(ctx);
    await ctx.stub.putState(carId, Buffer.from(JSON.stringify(car)));
    return JSON.stringify(car);
  }

  async finalizeAuction(ctx, carId) {
    const car = await this._getCar(ctx, carId);
    const invoker = this._invoker(ctx);
    if (invoker !== car.owner) throw new Error('Only owner finalize');
    if (car.highestBid >= car.reservePrice && car.highestBidder) {
      car.owner = car.highestBidder;
      car.isAuction = false; car.reservePrice = 0; car.highestBid = 0; car.highestBidder = '';
      await ctx.stub.putState(carId, Buffer.from(JSON.stringify(car)));
      return JSON.stringify({ result: 'SOLD', car });
    } else {
      car.isAuction = false;
      await ctx.stub.putState(carId, Buffer.from(JSON.stringify(car)));
      return JSON.stringify({ result: 'RESERVE_NOT_MET', car });
    }
  }

  async queryCar(ctx, carId) {
    const carBytes = await ctx.stub.getState(carId);
    if (!carBytes || carBytes.length === 0) throw new Error('No such car');
    return carBytes.toString();
  }

  async _getCar(ctx, id) {
    const bytes = await ctx.stub.getState(id);
    if (!bytes || bytes.length === 0) throw new Error('Car not found');
    return JSON.parse(bytes.toString());
  }

  _invoker(ctx) {
    const cid = ctx.clientIdentity;
    return cid.getMSPID() + ':' + cid.getID();
  }
}

module.exports = CarAuctionContract;
