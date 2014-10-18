var ab = ab || {};
!function(global) {
	//external function ----------------------------------------------------------
	//extend Date with output format
	Date.prototype.format = function(format) {
		var o = {
			"M+" : this.getMonth() + 1, // month
			"d+" : this.getDate(), // day
			"h+" : this.getHours(), // hour
			"m+" : this.getMinutes(), // minute
			"s+" : this.getSeconds(), // second
			"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
			"S" : this.getMilliseconds()
		// millisecond
		}
		if (/(y+)/.test(format))
			format = format.replace(RegExp.$1, (this.getFullYear() + "")
					.substr(4 - RegExp.$1.length));
		for ( var k in o)
			if (new RegExp("(" + k + ")").test(format))
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
						: ("00" + o[k]).substr(("" + o[k]).length));
		return format;
	}
	
	String.prototype.trim = function(){
		return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	}
	
	//parse date with string like 2010-10-9 8:54:20
	function parseDate(str){
	    return Date.parse(str.replace(/-/g,"/"));
	}
	
	function dateTest(date){
		var reDateTime = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/;
		return reDateTime.test(date);
	}
	
	function checkDate(date){
		if(date == '' || date == null || date == undefined){
			alert(hcms_ab_timenotnull);
			return;
		}
		if(dateTest(date) == false){
			alert('时间格式不对');
			return;
		}
	}
	//external function ----------------------------------------------------------
	
	//private function -----------------------------------------------------------
	function initialize(today){
		var baseUrl = "getAccelerateBrakesBetweenTime.action";
		var url = baseUrl + "?start=" + parseDate(today.start)+
		"&end=" + parseDate(today.end) + "&pageNumber=1" + "&pageSize=20" + 
		"&people=" + encodeURI(encodeURI('')) + "&time=" + new Date().getTime();
		$.ajax({url:url,type:"GET",dateType:"json"}).fail(function(jqXHR,textStatus){
			alert("error:" + jqXHR + " status:" + textStatus);
		}).done(function(data){
			var abDataObject = JSON.parse(data);
			//add analysis click link
			addAnalysisClickLink(abDataObject);
			//load data
			$("#rank_accelerate_brake").datagrid('loadData', abDataObject);
			
			//load pie graphy
			if(abDataObject.status == "success"){
				plotPie(abDataObject,$("#rankingPie"));
				//register paging event
				registPageEvent($("#rank_accelerate_brake"),getTruckForPage,
						loadDataGrid,parseDate(today.start),parseDate(today.end),
						$("#rank_name"),baseUrl);
				//register search event
				registRankSearch($("#rank_bnt_search"));
				//register tab change
				registerTabChange();
			}
			else{
				alert("该时间段内数据为空："+abDataObject.status);
			}
		})
	}
	
	function registerTabChange(){
		$("#tab_accelerate").tabs({
			onSelect:function(title){
				if(title == "月统计" && !global.monthDataInit){
					//init month statistic
					initQueryInMonth();
					global.monthDataInit = true;
				}
			}
		})
	}
	
	function initQueryInMonth(){
		var baseUrl = "getAccelerateBrakesMonth.action";
		var url = baseUrl + "?month="+
		''+"&people="+encodeURI(encodeURI(''))+"&pageNumber=1" + "&pageSize=20"+
		"&time="+new Date().getTime();
		$.ajax({url:url,type:"GET",dateType:"json"}).fail(function(jqXHR,textStatus){
			alert("error:" + jqXHR + " status:" + textStatus);
		}).done(function(data){
			var abDataObject = JSON.parse(data);
			addAnalysisClickLinkMonth(abDataObject);
			var options = abDataObject.options;
			for(var i = options.length-1; i >= 0; i--){
				$("#rank_month").append($("<option>"+options[i]+"</option>"));
			}
			$("#rank_accelerate_brake_month").datagrid('loadData',abDataObject);
			if(abDataObject.status == "success"){
				plotPie(abDataObject,$("#rankingPie_month"));
				//register paging event
				registPageEventMonth($("#rank_accelerate_brake_month"),getTruckForPageMonth,
						loadDataGrid,$("#rank_month"),$("#rank_name_month"),baseUrl);
				//register search
				registRankSearchMonth($("#rank_bnt_search_month"));
				registerSearchMonth($("#rank_month"));
			}else{
				alert("该时间段内数据为空："+abDataObject.status);
			}
		})
	}
	
	function queryInMonth(){
		var strMonth = $(this).find("option:selected").text();
		var strPeople = $("#rank_name_month").val();
		var pageSize = getPage($("#rank_accelerate_brake_month")).pageSize;
		var baseUrl = "getAccelerateBrakesMonth.action";
		var url = baseUrl + "?month="+strMonth+"&people="+encodeURI(encodeURI(strPeople))+
			"&pageNumber=1" + "&pageSize="+pageSize+"&time="+new Date().getTime();
		$.ajax({url:url,type:"GET",dateType:"json"}).fail(function(jqXHR,textStatus){
			alert("error:" + jqXHR + " status:" + textStatus);
		}).done(function(data){
			var abDataObject = JSON.parse(data);
			//add analysis click link
			addAnalysisClickLinkMonth(abDataObject);
			//load data
			$("#rank_accelerate_brake_month").datagrid('loadData', abDataObject);
			
			//load pie graphy
			if(abDataObject.status == "success"){
				plotPie(abDataObject,$("#rankingPie_month"));
			}
			else{
				alert("该时间段内数据为空："+abDataObject.status);
			}
		})
	}
	
	function registerSearchMonth(select){
		select.change(function(){
			queryInMonth();
		})
	}
	
	function getTodayTime(){
		//first load get default date
		var date = new Date();
	    var startTime = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
	    startTime = startTime + " 00:00:00";
	    var endTime = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
	    endTime = endTime + " 23:59:59";
	    return {start:startTime,end:endTime};
	}
	
	function displayRankTime(today){
		$("#rank_start_time").val(today.start);
		$("#rank_end_time").val(today.end);
	}
	
	//initilize click search function 
	function initQueryBetweenDate(startTime,endTime,peopleName){
		
		if(checkDate(startTime) || checkDate(endTime))
			return;
		lStart = parseDate(startTime);
		lEnd = parseDate(endTime);
		var pageSize = getPage($("#rank_accelerate_brake")).pageSize;
		var url = "getAccelerateBrakesBetweenTime.action?start=" + lStart+
		"&end=" + lEnd + "&pageNumber=1" + "&pageSize="+ pageSize + 
		"&people=" + encodeURI(encodeURI(peopleName)) + "&time=" + new Date().getTime();
		$.ajax({url:url,type:"GET",dateType:"json"}).fail(function(jqXHR,textStatus){
			alert("error:" + jqXHR + " status:" + textStatus);
		}).done(function(data){
			var abDataObject = JSON.parse(data);
			addAnalysisClickLink(abDataObject);
			$("#rank_accelerate_brake").datagrid('loadData', abDataObject);
			if(abDataObject.status == "success"){
				plotPie(abDataObject,$("#rankingPie"));
			}
		})
	}
	
	//add analysis click link
	function addAnalysisClickLink(dataObject){
		var dataArray = dataObject.rows;
		var size = dataArray.length;
		for(var i = 0; i < size; i++){
			var row = dataArray[i];
			var driver = row.driver;
			row.analysis = "<a title='分析' href='#' onclick=ab.analyseOneDriver('"+
			driver+"');return false;><img src='./resource/images/column_chart2_16.png' alt='#'>"+
					"</a>";
		}
	}
	function addAnalysisClickLinkMonth(dataObject){
		var dataArray = dataObject.rows;
		var size = dataArray.length;
		for(var i = 0; i < size; i++){
			var row = dataArray[i];
			var driver = row.driver;
			row.analysis = "<a title='分析' href='#' onclick=ab.analyseOneDriverMonth('"+
			driver+"');return false;><img src='./resource/images/column_chart2_16.png' alt='#'>"+
					"</a>";
		}
	}
	//register page event func
	function registPageEvent(dg,getFunc,loadFunc,startTime,endTime,peopleObj,url){
		var page = dg.datagrid('getPager');
		page.pagination({		
			onSelectPage:function(pageNumber, pageSize){
				var people = peopleObj.val().trim();
				setTimeout(function(){
					  var data = getFunc(pageNumber,pageSize,startTime,endTime,people,url);
					  loadFunc(data,dg);
				  },0);
				page.pagination({	
					pageNumber:pageNumber
				});
			},onRefresh:function(pageNumber, pageSize){
				var people = peopleObj.val().trim();
				setTimeout(function(){
					  var data = getFunc(pageNumber,pageSize,startTime,endTime,people,url);
					  loadFunc(data,dg);
				  },0);
			},onChangePageSize:function(pageSize){
				var people = peopleObj.val().trim();
				var opts = dg.datagrid('options');
				_pageNumber = opts.pageNumber;
//				_pageSize = opts.pageSize;
				setTimeout(function(){
					  var data = getFunc(_pageNumber,pageSize,startTime,endTime,people,url);
					  loadFunc(data,dg);
				  },0);
				page.pagination({	
					pageSize:pageSize
				});
			}		
		});
	}
	//register page event func
	function registPageEventMonth(dg,getFunc,loadFunc,monthObj,peopleObj,url){
		var page = dg.datagrid('getPager');
		page.pagination({		
			onSelectPage:function(pageNumber, pageSize){
				var people = peopleObj.val().trim();
				var month = monthObj.find("option:selected").text();
				setTimeout(function(){
					  var data = getFunc(pageNumber,pageSize,month,people,url);
					  loadFunc(data,dg);
				  },0);
				page.pagination({	
					pageNumber:pageNumber
				});
			},onRefresh:function(pageNumber, pageSize){
				var people = peopleObj.val().trim();
				var month = monthObj.find("option:selected").text();
				setTimeout(function(){
					  var data = getFunc(pageNumber,pageSize,month,people,url);
					  loadFunc(data,dg);
				  },0);
			},onChangePageSize:function(pageSize){
				var people = peopleObj.val().trim();
				var month = monthObj.find("option:selected").text();
				var opts = dg.datagrid('options');
				_pageNumber = opts.pageNumber;
//				_pageSize = opts.pageSize;
				setTimeout(function(){
					  var data = getFunc(_pageNumber,pageSize,month,people,url);
					  loadFunc(data,dg);
				  },0);
				page.pagination({	
					pageSize:pageSize
				});
			}		
		});
	}
	//load grid data
	function loadDataGrid(data,dg){
		dg.datagrid('loadData',data);
	}
	// ajax load data
	function getTruckForPage(pageNumber, pageSize, startTime, endTime,people,url) {
		var result = null;
		$.ajax({
			type : "post",
			async : false,
			url : url,
			data : {
				pageNumber : pageNumber,
				pageSize : pageSize,
				start : startTime,
				end : endTime,
				people:people
			},
			dataType : "json"
		}).fail(function(jqXHR,textStatus){
			alert("error:" + jqXHR + " status:" + textStatus);
		}).done(function(data){
			result = JSON.parse(data);
			addAnalysisClickLink(result);
		});	
	  return result;
	};
	
	// ajax load data by monthly query 
	function getTruckForPageMonth(pageNumber, pageSize, month,people,url){
		var result = null;
		$.ajax({
			type : "post",
			async : false,
			url : url,
			data : {
				pageNumber : pageNumber,
				pageSize : pageSize,
				month:month,
				people:people
			},
			dataType : "json"
		}).fail(function(jqXHR,textStatus){
			alert("error:" + jqXHR + " status:" + textStatus);
		}).done(function(data){
			result = JSON.parse(data);
			addAnalysisClickLinkMonth(result);
		});
	  return result;
	};
	
	function getPage(dg){
		var opts = dg.datagrid("getPager").pagination('options');
		_pageNumber = opts.pageNumber;
		_pageSize = opts.pageSize;
		page = {};
		page.pageNumber = _pageNumber;
		page.pageSize = _pageSize;
		return page;
	};
	
	function registRankSearch(search){
		search.click(function(){
			var startTime = $("#rank_start_time").datetimebox("getValue");
			var endTime = $("#rank_end_time").datetimebox("getValue");
			var peopleName = $("#rank_name").val().trim();
			initQueryBetweenDate(startTime,endTime,peopleName);
		})
	}
	function registRankSearchMonth(search){
		search.click(function(){
			queryInMonth();
		})
	}
	//open new graph page
	function go2GraphPage(driver, startTime, endTime){
		var tabTitle = driver + "-加减速分析";
		var tabTitleExist = $("#tab_accelerate").tabs('exists', tabTitle);
		if(tabTitleExist){	
			$("#tab_accelerate").tabs('select', tabTitle);
		}
		else{	
			var src= "Layout?page=accelerateGraph&driver="+
				encodeURI(encodeURI(driver))+"&startTime="+startTime+"&endTime="+endTime+
				"&month=";
			$('#tab_accelerate').tabs('add',{  
		        title: driver + "-加减速分析", 
		        content: '<iframe id="acclerateIframeAdd" name="accelerateIframeAdd" src='+ src
		        +' frameborder="0" width="100%" height="95%" scrolling="no"></iframe>',  
		        closable: true  
			}); 
		}
	}
	function go2GraphPageMonth(driver,month){
		var tabTitle = driver + "-月加减速分析";
		var tabTitleExist = $("#tab_accelerate").tabs('exists', tabTitle);
		if(tabTitleExist){	
			$("#tab_accelerate").tabs('select', tabTitle);
		}
		else{	
			var src= "Layout?page=accelerateGraph&driver="+
			encodeURI(encodeURI(driver))+"&startTime=&endTime=&month=" + month;
			$('#tab_accelerate').tabs('add',{  
		        title: driver + "-月加减速分析", 
		        content: '<iframe id="acclerateIframeAdd" name="accelerateIframeAdd" src='+ src
		        +' frameborder="0" width="100%" height="95%" scrolling="no"></iframe>',  
		        closable: true  
			}); 
		}
	}
	//highchart load data display graphy
	function plotPie(dataObj,jqueryObj){
		var pieData = dataObj.pieData;
		if(pieData == null || pieData.length == 0 || dataObj.total == 0)
			return;
		var timeDiff = dataObj.timeDiff;
		jqueryObj.highcharts({
	        chart: {
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false
	        },
	        title: {
	            text: '总次数('+timeDiff+')'
	        },
	        tooltip: {
	    	    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	        },
	        credits : {
                enabled:false
            },
	        plotOptions: {
	            pie: {
	                allowPointSelect: true,
	                cursor: 'pointer',
	                dataLabels: {
	                    enabled: true,
	                    color: '#000000',
	                    connectorColor: '#000000',
	                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
	                },
	                showInLegend:true
	            }
	        },
	        series: [{
	            type: 'pie',
	            name: '份额',
	            data: pieData
	        }]
	    });
	}

	//private function ----------------------------------------------------------
	
	//public function -----------------------------------------------------------
	//open api to external call
	global.analyseOneDriver = function(driver,startTime,endTime){
		startTime = startTime == null?
		    $("#rank_start_time").datetimebox("getValue"):startTime;
		endTime = endTime == null?
			$("#rank_end_time").datetimebox("getValue"):endTime;
		var startDate = parseDate(startTime);
		var endDate = parseDate(endTime);
		go2GraphPage(driver, startDate, endDate);
		//plotDataRequest(driver, startTime, endTime);
	}
	global.analyseOneDriverMonth = function(driver,month){
		month = month == null ? 
			$("#rank_month").find("option:selected").text():month;
		go2GraphPageMonth(driver, month);
	}
	//public function ----------------------------------------------------------
	
	//function main -----------------------------------------------------------
	
	var today = getTodayTime();
	displayRankTime(today);
	//first load ajax
	initialize(today);
	//function main -----------------------------------------------------------
}(ab)


