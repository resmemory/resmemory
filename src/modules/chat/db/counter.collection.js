import mongoose from 'mongoose';

// MongoDB 스키마 정의
const counterSchema = new mongoose.Schema({
  _id: String,
  seq: Number,
});

const pairingCounterSchema = new mongoose.Schema({
  nickname: String,
  seq: Number,
});

// Counters 모델 정의
const Counters = mongoose.model('Counters', counterSchema);
const PairingCounter = mongoose.model('PairingCounter', pairingCounterSchema);

class CountersManager {
  static getSequence = async (name) => {
    try {
      const counter = await Counters.findOneAndUpdate(
        { _id: name },
        { $inc: { seq: 1 } },
        { upsert: true, returnDocument: 'after' },
      );
      return counter.seq;
    } catch (error) {
      console.error('Error getting next sequence:', error);
      throw error;
    }
  };
}

class PairingCounterManager {
  static getPairingSequence = async (nickname) => {
    try {
      const filter = { nickname: nickname };
      const update = { $inc: { seq: 1 } };
      const options = { upsert: true, returnDocument: 'after' };
      const counter = await PairingCounter.findOneAndUpdate(filter, update, options);
      return counter.seq;
    } catch (error) {
      console.error('Error getting pairing sequence:', error);
      throw error;
    }
  };
}

export { CountersManager, PairingCounterManager };
