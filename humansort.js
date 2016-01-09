//binaryInsert(), tinySort(), hwangLinMerge(), mergeSort(), asyncCompare*(): 
//Copyright 2015 Fred Douglas. The rest is K-Factory@migiwa and anon, taken
//from http://tohosort.comoj.com/
//
//This file is part of HumanComparisonSort.
//
//HumanComparisonSort is free software; you can redistribute it and / or
//modify it under the terms of the GNU General Public License as published by
//the Free Software Foundation; either version 3 of the License, or
//(at your option) any later version.
//
//This program is distributed in the hope that it will be useful,
//but WITHOUT ANY WARRANTY; without even the implied warranty of
//MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
//GNU General Public License for more details.
//
//The full text of the license can be found at:
//http://www.gnu.org/licenses/gpl.html

// 2008/7/3 Scripted by K-Factory@migiwa
// 2008/7/19 Modified by  K-Factory@migiwa
// ・イラストのランダム化
// ・BugFix
// 2008/7/25 Modified by  K-Factory@migiwa
// ・ランキングにイラスト表示
// ・メンテナンス用PG追加
// ・BugFix
// 2009/1/27 Modified by  K-Factory@migiwa
// ・絵の表示ON/OFF追加
// ・高速化処理追加
// 2009/9/8 Modified by  K-Factory@migiwa
// ・タイトル分類の変更
// 2013/1/22 Modified by Anonymous
// added undo function (requires minor changes in index.html and fnc_data.js)
// 2015/12/29 Modified by FarFetchd
// -Replaced sorting logic: now uses Promises, so that recursive algorithms 
//  can work with the async comparisons
// -New sorting algorithm: still merge sort, but using Hwang-Lin merge.
//  (http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.419.8292)
//  Should result in several dozen fewer comparisons than the original 
//  vanilla merge when sorting ~100 items.
// -No more ties or undo - should be possible to add back in!

var csort = new Array();
var csort2 = new Array();
var csort3 = new Array();
var csort4 = new Array();
var csort5 = new Array();
var csort6 = new Array();

var int_Count = 0;
var int_Total = 0;
var int_Completed = 0;
var sID = 'GaGprog';
var iGM = 100;

var maxRows = 25;

var sortedCharacterData; //final sorted result; character data objects from ary_CharacterData


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
	
	//===============================================================
	//ABOVE: smaller_m, larger_n, alpha, and x are ONE-BASED indices
	larger_n--; smaller_m--; alpha--; x--;
	//BELOW: smaller_m, larger_n, alpha, and x are ZERO-BASED indices
	//===============================================================
	
	return asyncCompare(A[smaller_m], B[x]).then(function(compareResult)
	{
		if(compareResult == -1)//if(A[smaller_m] <= B[x])
		{
			//This case is: return hwangLinMerge(A, B[1 until x]) ~ B[x through end]
			
			var B_until_x = B.slice(0, x);
			var B_x_to_end = B.slice(x);
			
			return hwangLinMerge(A, B_until_x).then(function(mergedResult)
			{
				return mergedResult.concat(B_x_to_end);
			});
		}
		else
		{
			//Binary insert A[m] into the part of B right of x. This takes care of A[m]: 
			//we know that {A[m]} ~ {B right of A[m]} goes at the end of the result.
			//So, if we let D = {B starting from A[m]'s new spot}, then we should recurse like:
			//return HLMerge(A with A[m] removed), B - D) ~ D
			
			return binaryInsert(B, A[smaller_m], x+1, B.length).then(function(Am_dest_ind)
			{
				B.splice(Am_dest_ind, 0, A[smaller_m]);
				A = A.slice(0, A.length-1);
				
				var D = B.slice(Am_dest_ind);
				var B_minus_D = B.slice(0, Am_dest_ind);
				
				return hwangLinMerge(A, B_minus_D).then(function(AB_minus_D_merged)
				{
					return AB_minus_D_merged.concat(D);
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

function fnc_Sort(int_SelectID)
{
	int_Completed++;
	accessToPromise.resolve(int_SelectID);
}

function fnc_ShowData(leftData, rightData, sortingDone)
{
	gID("lblCount").innerHTML = int_Count;
	gID("lblProgress").innerHTML = Math.floor(int_Completed * 100 / int_Total);
	if (!bln_ProgessBar) eGR(sID, Math.floor(int_Completed * 100 / int_Total));

	if (sortingDone)
	{
		// 判定が終了していた場合、結果表示。
		var int_Result = 1;

		var tbl_Result = cE('table');
		tbl_Result.classList.add('resTable');

		var tbl_head_Result = cE('thead');
		tbl_Result.appendChild(tbl_head_Result);

		new_row = tbl_head_Result.insertRow(tbl_head_Result.rows.length);

		// Col[0]
		new_cell = new_row.insertCell(new_row.childNodes.length);
		sC(new_cell, 'resTableH');
		new_cell.appendChild(cT('Order'));
		// Col[1]
		new_cell = new_row.insertCell(new_row.childNodes.length);
		sC(new_cell, 'resTableH');
		new_cell.appendChild(cT('Name'));

		var tbl_body_Result = cE('tbody');
		tbl_Result.appendChild(tbl_body_Result);

		var int_Same = 1;

		var obj_SelectItem = gID("resultField");
		obj_SelectItem.innerHTML = "";
		obj_SelectItem.appendChild(tbl_Result);

		for (i=0; i<sortedCharacterData.length; i++) 
		{
			var rowId = i;
			new_row = tbl_body_Result.insertRow(tbl_body_Result.rows.length);

			// Col[0]
			new_cell = new_row.insertCell(new_row.childNodes.length);
			sC(new_cell, 'resTableL');
			new_cell.appendChild(cT(int_Result));

			csort2[i] = int_Result; // v2a

			// Col[1]
			new_cell = new_row.insertCell(new_row.childNodes.length);
			sC(new_cell, 'resTableR');

			var bln_imgFlag = false;
			if ((int_ResultImg != 0) && (i < int_ResultRank)) 
			{
				var new_img = cE('img');
				var obj_TempData = sortedCharacterData[i];

				if (obj_TempData[3].length > 0) 
				{
					new_img.src = str_ImgPath + obj_TempData[Math.floor(Math.random() * (obj_TempData.length -3)) + 3];
					new_cell.appendChild(new_img);
					new_cell.appendChild(cE('br'));
					bln_imgFlag = true;
				}
			}

			if ((int_ResultImg == 2) || (!bln_imgFlag)) 
			{
				new_cell.appendChild(cT(sortedCharacterData[i][1]));
				csort4[i] = sortedCharacterData[i][1]; // v2a
				csort6[i] = sortedCharacterData[i][1]; // v2a
			}

			// Break up results into a new table after every [maxRows] results,
			// or at the transition point between image and imageless results.
			// Do not break in the middle of image results.
			var cutoff = int_ResultRank - 1;
			if (rowId >= cutoff && rowId == cutoff || (rowId - cutoff) % maxRows == 0) 
			{
				tbl_Result = cE('table');
				tbl_Result.classList.add('resTable');
				tbl_body_Result = cE('tbody');
				tbl_Result.appendChild(tbl_body_Result);
				obj_SelectItem.appendChild(tbl_Result);
			}
		}

		if (bln_ResultStyle == 1)
			gID("mainTable").style.display = 'none';
		else if (bln_ResultStyle == 0)
			gID("ranTable").style.display = 'inline';
		// v2a

		// v2a start

		for (i=0; i<10; i++) 
		{
			if(csort4[i] == undefined)
				break;
			else
			{
				csort +=  csort2[i];
				csort += '位： ';
				csort4[i] = csort4[i].replace(/・(.*)/g, "");
				csort +=  csort4[i];
				csort += '　';
			}
		}
		for (i=0; i<130; i++) 
		{
			if(csort4[i] == undefined)
				break;
			else
			{
				csort5 +=  csort2[i];
				csort5 += '. ';
				csort5 +=  csort6[i];
				csort5 += '<br>';
			}
		}

		// v2a end	

	} 
	else 
	{
		var obj_SelectItem = gID("fldLeft");
		var obj_TempData = leftData;
		var obj_Item;
		if ((obj_TempData[3].length > 0) && gID('optImage').checked) 
		{
			obj_Item = cE("img");
			obj_Item.src = str_ImgPath + obj_TempData[Math.floor(Math.random() * (obj_TempData.length - 3)) + 3];
			obj_Item.title = obj_TempData[1];
		} 
		else 
		{
			obj_Item = cE("span");
			obj_Item.appendChild(cT(obj_TempData[1]));
		}
		obj_Item.title = obj_TempData[1];
		obj_SelectItem.replaceChild(obj_Item, obj_SelectItem.firstChild);
		
		//^^^ show left portrait
		//==================
		//VVV show right portrait
		
		obj_SelectItem = gID("fldRight");
		obj_TempData = rightData;
		if ((obj_TempData[3].length > 0) && gID('optImage').checked) 
		{
			obj_Item = cE("img");
			obj_Item.src = str_ImgPath + obj_TempData[Math.floor(Math.random() * (obj_TempData.length - 3)) + 3];
			obj_Item.title = obj_TempData[1];
		} 
		else 
		{
			obj_Item = cE("span");
			obj_Item.appendChild(cT(obj_TempData[1]));
		}
		obj_Item.title = obj_TempData[1];
		obj_SelectItem.replaceChild(obj_Item, obj_SelectItem.firstChild);
		

		int_Count++;
	}
}

// *****************************************************************************
// * StartUp
// * <BODY>タグの読み込み終了時に実行。
function startup() {
   var tbl_Select = gID('optTable');
   var tbl_body_Select = cE('tbody');
   tbl_Select.appendChild(tbl_body_Select);

   // タイトルから選択用チェックボックスに変換
   for (i=0; i<ary_TitleData.length; i++) {
      // Row[i]
      if ((i % int_Colspan) == 0) {
         var new_row = tbl_body_Select.insertRow(tbl_body_Select.rows.length);
         new_row.id = 'optSelRow' + i;
      }
      // Col[0]
      var new_cell = new_row.insertCell(new_row.childNodes.length);
      var new_CheckBox = cE('input');
      new_CheckBox.setAttribute('type', 'checkbox', 0);
      new_CheckBox.setAttribute('checked', 'true', 0);
      new_CheckBox.value = ary_TitleData[i];
      new_CheckBox.title = ary_TitleData[i];
      new_CheckBox.id = 'optSelect' + i;
      new_cell.appendChild(new_CheckBox);

      var new_span = cE('span');
      new_span.appendChild(cT(ary_TitleData[i]));
      new_span.title = ary_TitleData[i];
      new_span.id = i;
      sC(new_span, 'cbox');
      new_span.onclick = function() {chgFlag(this.id);}
      new_cell.appendChild(new_span);
   }

   gID('optImage').disabled = false;

   var tbl_foot_Select = cE('tfoot');
   tbl_Select.appendChild(tbl_foot_Select);

   // Row[0]
   var new_row = tbl_foot_Select.insertRow(tbl_foot_Select.rows.length);
   sC(new_row, "opt_foot");

   var new_cell = new_row.insertCell(new_row.childNodes.length);
   new_cell.setAttribute('colspan', int_Colspan, 0);
   var new_CheckBox = cE('input');
   new_CheckBox.setAttribute('type', 'checkbox', 0);
   new_CheckBox.setAttribute('checked', 'true', 0);
   new_CheckBox.value = "All";
   new_CheckBox.title = "All boxes are checked/unchecked at the same time.";
   new_CheckBox.id = 'optSelect_all';
   new_CheckBox.onclick = function() {chgAll();}
   new_cell.appendChild(new_CheckBox);

   var new_span = cE('span');
   new_span.appendChild(cT("Select All"));
   new_cell.appendChild(new_span);


   if (!bln_ProgessBar) fCG(sID, iGM, iGM);
}

function chgAll() {
   for (i=0; i<ary_TitleData.length; i++) {
      gID('optSelect' + i).checked = gID('optSelect_all').checked;
   }
}

// *****************************************************************************
// * chgFlag
// * タイトル名がクリックされてもチェックボックスを変更する。
function chgFlag(int_id) {
   var obj_Check = gID('optSelect' + int_id);
   if (!obj_Check.disabled) {
      obj_Check.checked = (obj_Check.checked) ? false :true;
   }
}

// *****************************************************************************
// * Image Initialize
// * メンテナンス用リスト
function imginit() {
   var int_ImgCount = 0;
   var int_ImgValue = 0;
   var int_ImgMax = 0;

   var tbl_Image_body = gID('imgTable');

   for (i=0; i<ary_CharacterData.length; i++) {
      new_row = tbl_Image_body.insertRow(tbl_Image_body.rows.length);

      // Col[0]
      new_cell = new_row.insertCell(new_row.childNodes.length);
      new_cell.appendChild(cT(i));
      sC(new_cell, 'resTableL');

      // Col[1]
      new_cell = new_row.insertCell(new_row.childNodes.length);
      new_cell.appendChild(cT(ary_CharacterData[i][1]));
      sC(new_cell, 'resTableR');

      // Col[2]
      new_cell = new_row.insertCell(new_row.childNodes.length);
      for (j=0; j<ary_TitleData.length; j++) {
         if (ary_CharacterData[i][2][j] == 1) {
         new_cell.appendChild(cT(ary_TitleData[j]));
         new_cell.appendChild(cE('br'));
         }
      }
      sC(new_cell, 'resTableR');

      // Col[3]
      new_cell = new_row.insertCell(new_row.childNodes.length);
      sC(new_cell, 'resTableR');

      if (ary_CharacterData[i][3].length > 0) {
         for (j=3; j<ary_CharacterData[i].length;j++) {
            var new_img = cE('img');
            new_img.src = str_ImgPath + ary_CharacterData[i][j];
            new_cell.appendChild(new_img);
            int_ImgCount++;
         }
         int_ImgValue++;
      }
      int_ImgMax++;
   }

   gID("lbl_imgCount").innerHTML = int_ImgCount;
   gID("lbl_imgParcent").innerHTML = Math.floor((int_ImgValue / int_ImgMax) * 100);
   gID("lbl_imgValue").innerHTML = int_ImgValue;
   gID("lbl_imgMax").innerHTML = int_ImgMax;
}

function fnc_CC(sID, sClass) { sC(gID(sID), sClass); }

function initItemsToSort()
{
	var int_Total = 0;
	var sortingInput = [];
	
	//Load characters according to which game boxes were checked
	for (i=0; i<ary_CharacterData.length; i++) 
		for (j=0; j<ary_TitleData.length; j++) 
			if (gID('optSelect' + j).checked && (ary_CharacterData[i][2][j] == 1)) 
			{
				sortingInput[int_Total] = ary_CharacterData[i];
				int_Total++;
				break;
			}
	int_Status = STATUS_INPROGRESS;
	
	return sortingInput;
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
	fnc_ShowData(item1, item2, false);
	
	return new Promise
	(
		function(resolve, reject)
		{
			accessToPromise.resolve = resolve;
			accessToPromise.reject = reject;
		}
	);
}

mergeSort(initItemsToSort())
.then(function(sortedResult)
{
	sortedCharacterData = sortedResult;
	fnc_ShowData(0, 0, true);
});

