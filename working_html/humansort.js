
//[left_bound, right_bound]. That is, left_bound might be inserted AT (i.e. its current index, but not -1), 
//								and right_bound might be inserted AT (current index, not +1).
//Returns (a promise of) an index that can be used to do items.splice(), with a still-sorted result
function binaryInsert(items, inserting, left_bound, right_bound)
{
	//alert("inserting "+inserting+" into "+items+", leftbound="+left_bound+", rightbound="+right_bound);
	
	if(items.length == 0)
		return Promise.resolve(0);
	
	if(right_bound == 0)
		return Promise.resolve(right_bound);
	
	if(left_bound == items.length)
		return Promise.resolve(right_bound);
	
	if(left_bound == right_bound)
		return asyncCompare(inserting, items[left_bound]).then(function(compareResult)
		{
			//return inserting <= items[left_bound] ? left_bound : left_bound + 1;
			if(compareResult == -1)//if(inserting <= items[left_bound])
				return left_bound;
			else
				return left_bound + 1;
		});
		
		
	if(left_bound + 1 == right_bound)
	{
		//if(inserting <= items[left_bound])
		//	return left_bound;
		//else if(right_bound == items.length || inserting <= items[right_bound])
		//	return right_bound;
		//else
		//	return right_bound + 1;
		
		return asyncCompare(inserting, items[left_bound]).then(function(compareResult)
		{
			//return inserting <= items[left_bound] ? left_bound : left_bound + 1;
			
			if(compareResult == -1)//if(inserting <= items[left_bound])
				return left_bound;
			else if(right_bound == items.length)
				return right_bound;
			
			return asyncCompare(inserting, items[right_bound]).then(function(compareResult2)
			{
				if(compareResult2 == -1)//if(inserting <= items[right_bound])
					return right_bound;
				else
					return right_bound+1;
			});
		});
		
	}
	
	var compare_ind = left_bound + Math.floor(((right_bound - left_bound) - 1) / 2);
	return asyncCompare(inserting, items[compare_ind]).then(function(compareResult)
	{
		if(compareResult == -1) //if((inserting) <= (items[compare_ind]))
			return binaryInsert(items, inserting, left_bound, compare_ind);
		else
			return binaryInsert(items, inserting, compare_ind + 1, right_bound);
	});
}

//Sorts 3 or fewer items (returns promise of the sorted array)
function tinySort(items)
{
	if(items.length == 3)
	{
		return asyncCompare(items[1], items[2]).then(function(compareResult12)
		{
			//if(items[1] <= items[2])
			if(compareResult12 == -1)
			{
				/*
				if(items[0] <= items[1])
					return items;
				else
				{
					if(items[0] <= items[2])
						return [items[1], items[0], items[2]];
					else
						return [items[1], items[2], items[0]];
				}*/
				return asyncCompare(items[0], items[1]).then(function(compareResult01)
				{
					if(compareResult01 == -1)
						return items;
					else
						return asyncCompare(items[0], items[2]).then(function(compareResult02)
						{
							if(compareResult02 == -1)
								return [items[1], items[0], items[2]];
							else 
								return [items[1], items[2], items[0]];
						});
				});
			}
			
			
			else
			{
				/*
				if(items[0] <= items[2])
					return [items[0], items[2], items[1]];
				else
				{
					if(items[0] <= items[1])
						return [items[2], items[0], items[1]];
					else
						return [items[2], items[1], items[0]];
				}*/
				return asyncCompare(items[0], items[2]).then(function(compareResult02)
				{
					if(compareResult02 == -1)
						return [items[0], items[2], items[1]];
					else
						return asyncCompare(items[0], items[1]).then(function(compareResult01)
						{
							if(compareResult01 == -1)
								return [items[2], items[0], items[1]];
							else 
								return [items[2], items[1], items[0]];
						});
				});
			}
		});
		
	}
	else if(items.length == 2)
	{
		//if(items[0] <= items[1])
		//	return items;
		//else
		//	return [items[1], items[0]];
		return asyncCompare(items[0], items[1]).then(function(compareResult01)
		{
			if(compareResult01 == -1)
				return items;
			else 
				return [items[1], items[0]];
		});
	}
	else if(items.length < 2)
		return Promise.resolve(items);
	alert("ERROR! tinySort() called on an array longer than 3 items.");
}


function i1to0(i) {return i-1;}
//(returns promise of the merged result)
function hwangLinMerge(A, B)
{
	if(A.length == 0)
		return Promise.resolve(B);
	if(B.length == 0)
		return Promise.resolve(A);
	
	//!!!'A' must always be the smaller array!!!
	if(A.length > B.length)
	{
		var tempA = A;
		A = B;
		B = tempA;
	}
	if(A.length == 1)
	{
		return binaryInsert(B, A[0], 0, B.length).then(function(A_dest_ind)
		{
			B.splice(A_dest_ind, 0, A[0]);
			return B;
		});
	}
	
	var larger_n = B.length;
	var smaller_m = A.length;
	
	//(all javascript numbers are doubles)
	var alpha = Math.floor(Math.log2(larger_n / smaller_m));
	var x = larger_n - Math.pow(2,alpha) + 1;
	
	//INDEXING FROM ONE EVERYWHERE. In the non-pseudo-code, i1to0 handles it; i.e. the input to i1to0 is a 1-based index.
	return asyncCompare(A[i1to0(smaller_m)], B[i1to0(x)]).then(function(compareResult)
	{
		if(compareResult == -1)//if(A[smaller_m] <= B[x])
		{
			//This case is: return hwangLinMerge(A, B[1 until x]) ~ B[x through end]
			
			var B_until_x = B.slice(0, i1to0(x));
			var B_x_to_end = B.slice(i1to0(x));
			
			return hwangLinMerge(A, B_until_x).then(function(mergedResult)
			{
				return mergedResult.concat(B_x_to_end);
			});
		}
		else
		{
			//Binary insert A[m] into the part of B right of x. This takes care of A[m]: 
			//we know that {A[m]} ~ {B right of A[m]} goes at the end of the result.
			//So, if we let D = {B right of A[m]}, then we should recurse like:
			//return HLMerge(A up to but not including m, B - D) ~ {A[m]} ~ D
			
			var B_x_plus1_to_end = B.slice(i1to0(x+1));
			return binaryInsert(B_x_plus1_to_end, A[i1to0(smaller_m)], 0, B_x_plus1_to_end.length).then(function(Am_dest_ind)
			{
				var AmD = B_x_plus1_to_end.slice(Am_dest_ind);
				AmD.splice(0, 0, A[i1to0(smaller_m)]);
				
				var B_minus_D = B.slice(0, i1to0(x+1));
				A = A.slice(0, A.length-1);
				
				return hwangLinMerge(A, B_minus_D).then(function(mergedResult)
				{
					return mergedResult.concat(AmD);
				});
			});
		}
	});
}

//returns promise of the sorted array
function mergeSort(items)
{
	if(items.length <= 3)
		return tinySort(items);
	
	var split_ind = items.length / 2;
	
	return mergeSort(items.slice(0, split_ind)).then(function(left_sorted)
	{
		return mergeSort(items.slice(split_ind)).then(function(right_sorted)
		{
			return hwangLinMerge(left_sorted, right_sorted);
		});
	});
}

//supposed to be -1 or 1
function reportComparisonResult(theResult)
{
	accessToPromise.resolve(theResult);
}

function displayTwoItems(leftData, rightData)
{
	document["leftImage"].src = leftData;
	document["rightImage"].src = rightData;
}

function showAllItems(allData)
{
	var resultHTML = "";
	var i;
	for(i=0; i<allData.length; i++)
		resultHTML += "<img src=\""+allData[i]+"\" /> <br> \n";
	
	for(i=0; i<allData.length; i++)
		resultHTML += allData[i] + " <br> \n";
	
	document.getElementById("imagesDiv").innerHTML = resultHTML;
}


var accessToPromise = {};
accessToPromise.resolve = function(){};
accessToPromise.reject = function(){};

//test version of asyncCompare with simple human input
function asyncCompareTESTHUMAN(item1, item2)
{
	//console.log("Comparing "+item1+" and "+item2);
	//alert("Comparing "+item1+" and "+item2);
	var thePromise = new Promise
	(
		function(resolve, reject)
		{
			accessToPromise.resolve = resolve;
			accessToPromise.reject = reject;
		}
	);
	var lessthan = confirm("True or false: "+item1+" < "+item2);
	if(lessthan)
		accessToPromise.resolve(-1);
	else
		accessToPromise.resolve(1);
	return thePromise;
}

//test version of asyncCompare; no human input, but still using Promises
function asyncCompareBASICTEST(item1, item2)
{
	//console.log("Comparing "+item1+" and "+item2);
	//alert("Comparing "+item1+" and "+item2);
	var thePromise = new Promise
	(
		function(resolve, reject)
		{
			accessToPromise.resolve = resolve;
			accessToPromise.reject = reject;
		}
	);
	if(item1 < item2)
		accessToPromise.resolve(-1);
	else
		accessToPromise.resolve(1);
	return thePromise;
}

//========================================================
//FOR TESTING:
//mergeSort([8,4,2,13,7,6,1,9,3,5,10,11,12,14,15]).then(function(sortedResult){alert(sortedResult);});
//When using this, comment out everything below, and 
//use one of the test versions of asyncCompare() above.

//The real asyncCompare().
function asyncCompare(item1, item2)
{
	displayTwoItems(item1, item2);
	
	return new Promise
	(
		function(resolve, reject)
		{
			accessToPromise.resolve = resolve;
			accessToPromise.reject = reject;
		}
	);
}

var theItemsToSort = [
"1447279977016.jpg",  "1449166829834.jpg",  "1449168156839.jpg", "1447280231705.jpg",
"1449167745953.jpg",  "catbooks.jpg", "1447280298568.jpg",  "1449168099140.jpg"
];

mergeSort(theItemsToSort)
.then(function(sortedResult)
{
	showAllItems(sortedResult);
});
