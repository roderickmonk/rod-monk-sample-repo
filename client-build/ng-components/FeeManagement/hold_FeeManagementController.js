"use strict";

moment			= require ('moment');

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

function findSubList (listOfLists, emailaddress)
{
	if (emailaddress)
	{
		// Search to see if the emailaddress has already been allocated to a list
		for (var j=0; j<listOfLists.size (); ++j)
		{
			for (var k=0; k<listOfLists.item(j).size (); ++k)
			{
				if (listOfLists.item(j).item(k).emailaddress.toLowerCase() == emailaddress.toLowerCase() &&
				   	!listOfLists.item(j).item(k).student)  // students are always their own sublist
				{
					return listOfLists.item(j);
				}
			}
		}
	}
	return null;
}

function AddMemberToSublist (SubList, member)
{
	// Students are their own sublist
	if (member.student)
		return;
	
	// Search to see if the emailaddress has already been allocated to a list
	for (var i=0; i<SubList.size (); ++i)
	{
		// If the member is already in the sublist or a student, then nothing to do
		if (SubList.item(i)._id === member._id)
			return;
	}
	
	// Member not found - add to the  sublist
	SubList.add (member);
}

function CountTotalInSublists (listOfLists)
{
	var count = 0;
	for (var i=0; i<listOfLists.size (); ++i)
	{
		count += listOfLists.item(i).size ();
		if (listOfLists.item(i).size () > 1)
		{
			console.log ('Multiple sublist');
			for (var j=0; j<listOfLists.item(i).size (); ++j)
			{
				console.log ('email address, _id, Firstname, Family Name: ' + 
							 listOfLists.item(i).item(j).emailaddress, + ', ' + 
							 listOfLists.item(i).item(j)._id + ', ' + 
							 listOfLists.item(i).item(j).firstname + ', ' + 
							 listOfLists.item(i).item(j).familyname);
			}
		}
	}
	return count;
}

app.controller('FeeManagementController', ['$scope', '$http', '$modalInstance', 'UserService', 'MemberService', '$log', '$window',
function ($scope, $http, $modalInstance, UserService, MemberService, $log, $window) {

	function GenerateAccounts ()
	{
		var listOfLists = new LinkedList;
		
		$scope.accounts = [];
		
		var StartOfSeason = moment ('2016-04-01');
		console.log ('Start of season: ', StartOfSeason);

		// Get email addresses and phone numbers for all members
		var req = {
			method: 'POST',
			url: '/api/getmembers',
			headers: {'Cache-Control': 'no-cache', 'x-auth': UserService.getToken ()},
			data: null
		};
		var promise = $http(req);
		promise.then(
				function (response) 
				{
					for (var i=0; i<response.data.length; ++i)
					{	
						// Ensure that every member document has a 'paid' field
						if (typeof response.data[i].paid === 'undefined')
						{
							response.data[i].paid = false;
						}
						
						var FamilyMemberSubList;
						var MemberSublist;
						
						// Students get special treatment - give them their own sublist
						if (response.data[i].student)
						{
							MemberSublist = new LinkedList;
							MemberSublist.add (response.data[i]);
							listOfLists.add (MemberSublist);
						}
						else { 
						
							// Search to see if the member's familyemailaddress has already been allocated to a list
							if (FamilyMemberSubList = findSubList (listOfLists, response.data[i].familyemailaddress))
							{
								// If so, the member should be added to that same sublist if not already there
								AddMemberToSublist (FamilyMemberSubList, response.data[i]);
							}
							else 
							{
								// Check to see if we need a new sublist
								if (!(MemberSublist = findSubList (listOfLists, response.data[i].emailaddress)))
								{
									MemberSublist = new LinkedList;
									MemberSublist.add (response.data[i]);

									// Add the new sublist to the list of lists
									listOfLists.add (MemberSublist);
								}

								// Include those members using the same emailaddress or familyemailaddress
								for (var j=i+1; j<response.data.length; ++j)
									if (response.data[i].emailaddress.toLowerCase() === response.data[j].emailaddress.toLowerCase() || 
										(response.data[i].familyemailaddress && response.data[i].familyemailaddress.toLowerCase() === response.data[j].emailaddress.toLowerCase()) ||
										(response.data[j].familyemailaddress && (response.data[i].emailaddress.toLowerCase() === response.data[j].familyemailaddress.toLowerCase()))
									   )
									{
										AddMemberToSublist (MemberSublist, response.data[j]);
									}
							}
						}
					}
					console.log ('Total Members: ', response.data.length);
					console.log ('Total sublists: ', listOfLists.size ());
					console.log ('Total count in sub lists: ', CountTotalInSublists (listOfLists));
					
					// Now create the accounts from the listOfLists
					$scope.accounts = [];
					for (var i=0; i<listOfLists.size (); ++i)
					{
						// The name of the oldest person is to be the name of the account
						var oldest = 0;
						for (var j=1; j<listOfLists.item(i).size (); ++j)
							if (listOfLists.item(i).item(j).dob < listOfLists.item(i).item(oldest).dob)
								oldest = j;
						
						// If everyone in a sublist is flagged as paid, 
						// then the Account as a whole is flagged as paid
						var paid 	= true;
						for (var j=0; j<listOfLists.item(i).size (); ++j)
						{
							paid = paid && listOfLists.item(i).item(j).paid;
						}
						
						// Determine the fees for the account
						var fees		= 0;				
						fee_calculation:
						{
							var adults 		= 0;
							var juniors		= 0;
							for (var j=0; j<listOfLists.item(i).size (); ++j) {
								
								// Students get special handling
								if (listOfLists.item(i).item(j).student) {
									fees = '105.00';
									break fee_calculation;
								}

								// Younger than 18 is a junior
								var dob = moment (listOfLists.item(i).item(j).dob,['MM-DD-YYYY', 'YYYY-MM-DD']);
								var diff = StartOfSeason.diff (dob,'years');
								if (diff < 18)
									++juniors;
								else
									++adults;
							}

							if (adults == 1) {
								if (juniors == 0) 
									fees = '246.75'
								else if (juniors == 1) 
									fees = '300.00'
								else if (juniors >= 2) 
									fees = '350.00'
							} else if (adults == 2) {
								if (juniors == 0) 
									fees = '388.50'
								else 
									fees = '450.00';
							}
							else
							{
								console.log ('adults, juniors: ' + adults + ', ' + juniors);
								fees = 'ERROR'; // We have a problem if here.
							}
						}
						
						// Create the tooltips for the account
						var tooltip = "";
						for (var j=0; j<listOfLists.item(i).size (); ++j)
						{
							tooltip += _.capitalize (listOfLists.item(i).item(j).firstname + ' ' + 
													 listOfLists.item(i).item(j).familyname + ', DoB: ' + 
													 listOfLists.item(i).item(j).dob);
							if (j<listOfLists.item(i).size ()-1) tooltip += ' | '
						}
						
						//console.log ('account members:\n', JSON.stringify (listOfLists.item (i).toArray (), null, 4));
						var account = {		members: listOfLists.item (i).toArray (),
											accountname: _.capitalize(listOfLists.item(i).item(oldest).familyname + ', ' + listOfLists.item(i).item(oldest).firstname),
									   		emailaddress: listOfLists.item(i).item(oldest).emailaddress,
									    	paid: paid,
									   		fees: fees,
									   		tooltip: tooltip
									  };
						$scope.accounts.push (account);
					}	
					$scope.accounts.sort (function (a, b) {if (a.accountname > b.accountname) return 1; if (a.accountname < b.accountname) return -1; return 0;});
				}
			)
			.catch(
				function (response) {
					$window.alert (response.data + ' - please contact the TTC WebMaster');
				}
			)
	}
	
	GenerateAccounts ();
	
	$scope.Toggle = function (account)
	{
		for (var i=0; i<account.members.length; ++i)
		{
			account.members[i].paid = !account.paid;
			MemberService.saveMember (account.members[i], function (err) {	
				if (err)
					$window.alert(err + ' - please contact the TTC WebMaster');
			});
		}
	}
	
	$scope.Close = function () {
		$modalInstance.dismiss('No');
	}
}]);
