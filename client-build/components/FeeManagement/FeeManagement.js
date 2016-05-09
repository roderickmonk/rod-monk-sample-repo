"use struct";

/*
 * Linked List implementation in JavaScript
 * Copyright (c) 2009 Nicholas C. Zakas
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * A linked list implementation in JavaScript.
 * @class LinkedList
 * @constructor
 */
function LinkedList() {

    /**
     * The number of items in the list.
     * @property _length
     * @type int
     * @private
     */
    this._length = 0;
    
    /**
     * Pointer to first item in the list.
     * @property _head
     * @type Object
     * @private
     */
    this._head = null;
}

LinkedList.prototype = {

    //restore constructor
    constructor: LinkedList,
    
    /**
     * Appends some data to the end of the list. This method traverses
     * the existing list and places the value at the end in a new item.
     * @param {variant} data The data to add to the list.
     * @return {Void}
     * @method add
     */
    add: function (data){
    
        //create a new item object, place data in
        var node = { 
                data: data, 
                next: null 
            },
            
            //used to traverse the structure
            current;
    
        //special case: no items in the list yet
        if (this._head === null){
            this._head = node;
        } else {
            current = this._head;
            
            while(current.next){
                current = current.next;
            }
           
            current.next = node;            
        }
        
        //don't forget to update the count
        this._length++;
    
    },
    
    /**
     * Retrieves the data in the given position in the list.
     * @param {int} index The zero-based index of the item whose value 
     *      should be returned.
     * @return {variant} The value in the "data" portion of the given item
     *      or null if the item doesn't exist.
     * @method item
     */
    item: function(index) {
    
        //check for out-of-bounds values
        if (index > -1 && index < this._length){
            var current = this._head,
                i = 0;
                
            while(i++ < index){
                current = current.next;            
            }
        
            return current.data;
        } else {
            return null;
        }
    },
    
    /**
     * Removes the item from the given location in the list.
     * @param {int} index The zero-based index of the item to remove.
     * @return {variant} The data in the given position in the list or null if
     *      the item doesn't exist.
     * @method remove
     */
    remove: function(index){
    
        //check for out-of-bounds values
        if (index > -1 && index < this._length){
        
            var current = this._head,
                previous,
                i = 0;
                
            //special case: removing first item
            if (index === 0){
                this._head = current.next;
            } else {
        
                //find the right location
                while(i++ < index){
                    previous = current;
                    current = current.next;            
                }
            
                //skip over the item to remove
                previous.next = current.next;
            }
        
            //decrement the length
            this._length--;
        
            //return the value
            return current.data;            
        
        } else {
            return null;
        }
    
    },
    
    /**
     * Returns the number of items in the list.
     * @return {int} The number of items in the list.
     * @method size
     */
    size: function(){
        return this._length;
    },
    
    /**
     * Converts the list into an array.
     * @return {Array} An array containing all of the data in the list.
     * @method toArray
     */
    toArray: function(){
        var result = [],
            current = this._head;
        
        while(current){
            result.push(current.data);
            current = current.next;
        }
        
        return result;
    },
    
    /**
     * Converts the list into a string representation.
     * @return {String} A string representation of the list.
     * @method toString
     */
    toString: function(){
        return this.toArray().toString();
    }
};

var listOfLists = new LinkedList;

function findSubList (emailaddress)
{
	// Search to see if the emailaddress has already been allocated to a list
	for (var j=0; j<listOfLists.size (); ++j)
	{
		for (var k=0; k<listOfLists.item(j).size (); ++k)
		{
			if (listOfLists.item(j).item(k).emailaddress.toLowerCase () === emailaddress)
				return listOfLists.item(j).item(k);
			else
				return null;
		}
	}
}

app.controller('FeeManagementController', ['$scope', '$http', 'UserService', '$log',
function ($scope, $http, UserService, $log) {

		// Get email addresses and phone numbers for all members
		var req = {
			method: 'POST',
			url: '/api/getmembers',
			headers: {
				'x-auth': UserService.getToken()
			},
			data: null
		};
		var promise = $http(req);
		promise.then(
				function (response) 
				{
					//console.log ('response.data"\n', JSON.stringify (response.data, null, 4));

					for (var i=0; i<response.data.length; ++i)
					{
						var memberFound = false;
						
						// Search to see if the emailaddress has already been allocated to a list
						var foundMemberSubList = findSubList (response.data[i].emailaddress);
						
						if (foundMemberSubList)
						{
							// ToDo: Then the family address should be added to that same Sublist
						}
						else
						{
							// Not found.  Next check whether the family email address is already in
							if (response.data[i].familyemailaddress)
							{
								var foundFamilyMemberSublist = findSubList (response.data[i].familyemailaddress);
								if (foundFamilyMemberSublist)
								{
									// Add in the member to that sublist
									foundFamilyMemberSublist.add (response.data[i]);
								}
							}
						}
						
						for (var j=0; j<listOfLists.size (); ++j)
						{
							for (var k=0; k<listOfLists.item(j).size (); ++k)
							{
								if (listOfLists.item(j).item(k).emailaddress.toLowerCase () === response.data[i].emailaddress.toLowerCase ())
								{
									memberFound = true;
									// Member is already in a list - add the family member to the same list
									if (response.data[i].familyemailaddress)
									{										
										// Include any family member as well into this same sub list
										if (response.data[i].familyemailaddress)
										{
											for (var l=0; l<response.data.length; ++l)
											{
												if (response.data[i].familyemailaddress.toLowerCase () === response.data[l].emailaddress.toLowerCase ())
												{
													listOfLists.item(j).add (response.data[l]);
													break;
												}
											}
										}
									}
								}
							}
						}
						if (!memberFound)
						{
							// Need to add a new sublist to contain the new member
							var subList = new LinkedList;
							subList.add (response.data[i]);
							
							// Include any family member into the new sub list
							if (response.data[i].familyemailaddress)
							{
								for (var l=0; l<response.data.length; ++l)
								{
									if (response.data[i].familyemailaddress.toLowerCase () === response.data[l].emailaddress.toLowerCase ())
									{
										subList.add (response.data[l]);
										break;
									}
								}
							}
							
							// Then add in the new sub list
							listOfLists.add (subList);
						}
					}
					// Count up how may members of been recorded into all of the sub lists
					console.log ('Total Members: ', response.data.length);
					console.log ('Total sublists: ', listOfLists.size ());
					var count = 0;
					for (var i=0; i<listOfLists.size (i); ++i)
					{
						console.log ('sublist: ', i);
						count += listOfLists.item(i).size ();
						for (var j=0; j<listOfLists.item(i).size (); ++j)
						{
							console.log ('email address: ', listOfLists.item(i).item(j).emailaddress);
						}
					}
					console.log ('Total count in sub lists: ', count);
				}
			)
			.catch(
				function (response) {
					$log.info('Error Data: ', response.data);
					$log.info('Error Status: ', response.status);
				}
			)
}]);
