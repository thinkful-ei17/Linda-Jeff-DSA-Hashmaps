'use strict';


class HashMap {
  constructor(initialCapacity=8) {
    this.length = 0;
    this._slots = [];
    this._capacity = initialCapacity;
    this._deleted = 0;
  }

  get(key) {
    const index = this._findSlot(key);
    if (this._slots[index] === undefined) {
      throw new Error('key error');
    }
    return this._slots[index].value;
  } 

  set(key, value) {
    // loadRatio needs to remain below .9 (The MAX_LOAD_RATIO). If it gets above .9,
    // we have to resize and increase capacity. Ex: 8 + 1 = 9 (length) / 8 (capacity)
    // loadRatio is greater than Max -> resize, capacity (8) * 3 = 24.

    // Why are MAX_LOAD_RATIO and SIZE_RATIO .9 & 3, respectively?
    // Is the +1 to ensure that the Hashmap length has a 1 item buffer before capacity?
    const loadRatio = (this.length + this._deleted + 1) / this._capacity;
    if (loadRatio > HashMap.MAX_LOAD_RATIO) {
      this._resize(this._capacity * HashMap.SIZE_RATIO);
    }

    //findSlot is checking if the expected spot is available for the hashed key,
    //if not, it iterates until it finds an empty spot.
    const index = this._findSlot(key);

    //Then, the data is inserted at that slot.
    this._slots[index] = {
      key,
      value,
      deleted: false
    };

    this.length++;
  }

  remove(key) {
    const index = this._findSlot(key);
    const slot = this._slots[index];
    if (slot === undefined) {
      throw new Error('key error');
    } 
    slot.deleted = true;
    this.length--;
    this._deleted++;
  }

  _findSlot(key) {
    const hash = HashMap._hashString(key);
    const start = hash % this._capacity;

    //starts at index slot we initially were asigned
    //checks if the initial slot key is
    for (let i=start; i<start + this._capacity; i++) {
      const index = i % this._capacity;
      const slot = this._slots[index]; 
      //The constructor sets up an array called _slots which will hold all of the data; gives array to loop through 
      //slot = undefined (ie. no data inside slot. empty slot 
      //OR slot with matching key and it has not been deleted
      //deleted marker is not deleting data per se but moreso pseudo deleting spot from the hashmap with 'true' boolean
      //deleted items (marked true) get really deleted at resize
      if (slot === undefined || (slot.key == key && !slot.deleted)) { 
        return index;
      }
    }
  }

  




}