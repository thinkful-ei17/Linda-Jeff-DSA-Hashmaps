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

    // Q: Why are MAX_LOAD_RATIO and SIZE_RATIO .9 & 3, respectively?
    // For purpose of exercise, although .85-.9 is a good load ratio to use, 3 is just arbitrary for drills use
    // Q: Is the +1 to ensure that the Hashmap length has a 1 item buffer before capacity?
    //length + deleted == current number of slots used 
    //+1 == number that WILL BE used after you add this one
    //ie +1 'loadRatio is greater than Max Load Ratio (.9), therefore, increase size
    //length - used; deleted - not used 
    //0 index; +1 compensate for difference
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

  _resize(size) {
    const oldSlots = this._slots;
    this._capacity = size; //capacity will now be set to old capacity (all of the available slots we started initally with, ignoring whether the slot has data or not)
    //times size ratio
    // Reset the length - it will get rebuilt as you add the items back
    this.length = 0;
    this._deleted = 0;
    this._slots = [];

    for (const slot of oldSlots) {
      if (slot !== undefined && !slot.deleted) //only keep the slots that are empty and slots that are not deleted (dleted items are those that are marked 'true' through _remove)
      { //copying those retained keys and values and putting them in new hash map
        this.set(slot.key, slot.value);
      }
    }
  }

  static _hashString(string) {
    let hash = 5381;
    for (let i=0; i<string.length; i++) {
        hash = (hash << 5) + hash + string.charCodeAt(i);
        hash = hash & hash;
    }
    return hash >>> 0;
  }
}

HashMap.MAX_LOAD_RATIO = 0.9;
HashMap.SIZE_RATIO = 3;