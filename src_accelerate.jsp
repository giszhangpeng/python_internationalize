<%@page import="com.cetiti.vms.utils.propertiesparser.ResConstString"%>
<%@page import="com.cetiti.vms.utils.propertiesparser.UserDefaultUtil"%>
<%@page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Accelerate and Brake</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resource/themes/default/easyui.css"/> 
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resource/themes/icon.css"/> 
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resource/css/accelerate.css"> 
<link rel="shortcut icon" href="${pageContext.request.contextPath}/resource/images/tab_logo.png"/>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/external/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/external/jquery.easyui.min.js"></script> 
<script type="text/javascript" src="${pageContext.request.contextPath}/js/external/json2.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/external/easyui-lang-zh_CN.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/external/jquery.i18n.properties-1.0.9.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/locale.js"></script>



<script type="text/javascript" src="${pageContext.request.contextPath}/js/external/highcharts.js"></script>

</head>
<body>
    <div class="wrapper">
        <div id="tab_accelerate" class="easyui-tabs" data-options="fit:true">
	        <div title="<%= UserDefaultUtil.get(ResConstString.HCMS_AB_STATISTIC) %>">
		        <div id="rankAd" style="width:auto;height:100%;">
		            <div id="rankPanel" title="<%= UserDefaultUtil.get(ResConstString.HCMS_AB_STATISTIC) %>" style="height:100%;">
		              <div style="height:100%;">
		                  <div style="margin:0 5px">
		                   <label><%= UserDefaultUtil.get(ResConstString.HCMS_AB_STARTTIME) %>：</label>
		                   <input id="rank_start_time" class="easyui-datetimebox" style="width:160px">
		                   <label>结束时间：</label>
		                   <input id="rank_end_time" class="easyui-datetimebox" style="width:160px">
		                   <label>姓         名: </label><input id="rank_name" title="模糊搜索" type="text" style="width:80px">
		                   <a id="rank_bnt_search" style="margin-left:5px;" href="#" class="easyui-linkbutton" data-options="iconCls:'icon-search'">搜索</a>
		                  </div>
		                  <div style="height:90%;width:100%;display:block;">
		                       <div id='rankingPie' class='pie' style="float:right;height:100%;min-height:200px; width:430px;"></div>
		                       <div style="height:100%;margin-right:440px;">
		                          <table id="rank_accelerate_brake" class="easyui-datagrid" data-options="
		                              singleSelect:true,
		                              rownumbers:true,
		                              pagination:true,
		                              pageSize:20,
		                              loadMsg: '',
		                              		                          
		                              columns: [[
		                                  {field:'carNum',title:'车牌号', width:90, align:'left'},
		                                  {field:'driver',title:'驾驶员', width:90, align:'left'},
		                                  {field:'accelerate',title:'急加速次数', width:80, align:'left'},
		                                  {field:'brake',title:'急刹车次数', width:80, align:'left'},
		                                  {field:'total',title:'总次数', width:80, align:'left'},
		                                  {field:'analysis', title:'急加速减速统计', width:100, align:'left'}
		                              ]]">
		                          </table>
		                      </div> 
		                  </div>
		              </div>
		            </div>
		        </div>
	        </div>
	        <div title="月统计">
                <div id="rankAd_month" style="width:auto;height:100%;">
                    <div id="rankPanel_month" title="月统计" style="height:100%;">
                      <div style="height:100%;">
                          <div style="margin:0 5px">
                           <label>月份：</label>
                           <select id="rank_month" style="padding:0 2px">
                           </select>
                           <label>姓名: </label>
                           <input id="rank_name_month" type="text" style="padding:0 2px" />
                           <a id="rank_bnt_search_month" style="margin-left:5px;" href="#" class="easyui-linkbutton" data-options="iconCls:'icon-search'">搜索</a>
                          </div>
                          <div style="height:90%;width:100%;display:block;">
                               <div id='rankingPie_month' class='pie' style="float:right;height:100%;min-height:200px; width:430px;"></div>
                               <div style="height:100%;margin-right:440px;">
                                  <table id="rank_accelerate_brake_month" class="easyui-datagrid" data-options="
                                      singleSelect:true,
                                      rownumbers:true,
                                      pagination:true,
                                      pageSize:20,
                                      loadMsg: '',
                                                                      
                                      columns: [[
                                          {field:'carNum',title:'车牌号', width:90, align:'left'},
                                          {field:'driver',title:'驾驶员', width:90, align:'left'},
                                          {field:'accelerate',title:'急加速次数', width:80, align:'left'},
                                          {field:'brake',title:'急刹车次数', width:80, align:'left'},
                                          {field:'total',title:'总次数', width:80, align:'left'},
                                          {field:'analysis', title:'急加速减速统计', width:100, align:'left'}
                                      ]]">
                                  </table>
                              </div> 
                          </div>
                      </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/accelerate.js"></script>
</body>
</html>
