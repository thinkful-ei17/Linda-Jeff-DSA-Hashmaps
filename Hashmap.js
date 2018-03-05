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
      //throw new Error('key error');
      return false;
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


const main = () => {
  const lor = new HashMap();
  // lor.set('Hobbit1', 'Bilbo');
  // console.log(JSON.stringify(lor));
  // lor.set('Hobbit2', 'Frodo');
  // console.log(JSON.stringify(lor));
  // lor.set('Wizard', 'Gandalf');
  // lor.set('Human', 'Aragon');
  // lor.set('Elf', 'Legolas');
  // lor.set('Maiar', 'The Necromancer');  
  // console.log(JSON.stringify(lor));
  // lor.set('Maiar', 'Sauron');
  // lor.set('RingBearer', 'Gollum');
  // console.log(JSON.stringify(lor));
  lor.set('LadyOfLight', 'Galadriel');
  lor.set('HalfElven', 'Arwen');
  lor.set('Ent', 1); //testing for other drills
  // console.log(JSON.stringify(lor));
  // console.log(lor.get('Hi'));
  //console.log(lor.get('Maiar'));
  //console.log(JSON.stringify(lor));
};

//main();

const drillPalindrome = (string) => {
  const palindrome = new HashMap();
  let isPalindrome;

  console.log(palindrome);
  //loop to break up mom and capture indiv letters to assign as keys with value of 1
  for (let i=0; i < string.length; i++){
    if(palindrome.length === 0 || palindrome.get(string[i]) === false){ //first one will kick - pay attention to logic order!
    //if value does not exist, therefore letter is new
    //console.log('string letter is',string[i]);
      palindrome.set(string[i], 1);
    }
    else {
      let count = palindrome.get(string[i]);
      count++; //2
      palindrome.set(string[i], count); //overrides previous value count
    }
  }
  //!ONLY ONE INSTANCE OF key LETTER WITH ODD VALUE!
  //count for number of instances of odd count
  let countOddInstances = 0; //must be outside for loop so it does not reset to 0 each loop instance
  for (let j = 0; j < string.length; j++){
    //console.log('hi',palindrome.get(string[j]));
    if(palindrome.get(string[j]) % 2 !== 0){ //if value is odd then count number of instanes of odd values for keys ex. 10 % 2 = 0 (even)
      countOddInstances++;
      console.log('countOddInstances else', countOddInstances);
    }
  }

  if(countOddInstances > 1) {
    console.log('countOddInstances', countOddInstances);
    return false;
  }
  return true;
};

// console.log(drillPalindrome('tattarrattat'));
/*

Palindrome = aa, aba, aabbb
Not Palindrome = ab
Any permutation a palindrome
Write an algorithm to check whether any permutation of a string is a palindrome. Given the string "acecarr", the algorithm should return true, because the letters in "acecarr" can be rearranged to "racecar", which is a palindrome. In contrast, given the word "north", the algorithm should return false, because there's no way to rearrange those letters to be a palindrome.

Notes:  IF NEW LETTER, STICK IN HASH MAP
palindrome.set('m', 1); COUNT
IF EXISTING KEY; REPLACE VALUE WITH +1
!ONLY ONE INSTANCE OF key LETTER WITH ODD VALUE!

-eat
key:e
value:1
key: a
value: 1
key: t
value: 1

isPalindrome = false

-dad
key: d
value: 2
key: a
value 1

isPalindrome = true

AMANAPLANACANALPANAMA
key: A
value: 10

key: M
value: 2

key: N
value: 4

key: P
value: 2

key: L
value: 2

key: C
value: 1

count any time you come across the letter (same) increase value by 1 increment - loop all letters
if more than one key with a value of 1, then we know its not a palindrome because only 1 letter can have value of 1 => return false for isPalindrome
*/

/*

Anagram grouping
Write an algorithm to group a list of words into anagrams. For example, if the input was ['east', 'cars', 'acre', 'arcs', 'teas', 'eats', 'race'], the output should be: [['east', 'teas', 'eats'], ['cars', 'arcs'], ['acre', 'race']].

FIND AND GROUP ANAGRAM WORDS COUNT 
DOUBLE FOR LOOP
*/

//

const drillAnagram = (arr) => {
  const anagram = new HashMap();

  //Our first attempt:
  // for (let i=0; i < arr.length; i++) {
  //   for (let j=0; i < arr[i].length; i++) {
  //     anagram.set(arr[i][j], i);
  //   }
  // }
  //1. Loop over each string -> store the string to a key/value.  key: 'east', value: 1.

  //2. Loop over each key/value pair -> when a key/value pair matches .string(includes(value)),
  //push both into a new Array.

  // for (let i = 0; i < arr.length; i++) {
  //   if (anagram.get(arr[j])) {
  //   }
  // }

  //Chris's text: is_anagram(word1, word2)
  //is_anagram("eats", "stea") ==> true
  //is_anagram("acre", "cars") ==> false
};

// drillAnagram(['east', 'eats', 'cars']);

//Input: ['east', 'eats', 'cars']
//Output: [['east', 'eats'] ['cars']]