/*
 * File Name: AccelerateBrakeColumnService.java
 * Copyright: Copyright 2012-2013 CETC52 CETITI All Rights Reserved.
 * Description: 
 * Author: Zhangpeng
 * Create Date: 2014-9-17

 * Modifier: Zhangpeng
 * Modify Date: 2014-9-17
 * Bugzilla Id: 
 * Modify Content: 
 */
package com.cetiti.hcms.accelerate.service;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;

import java.util.Calendar;
import java.util.List;
import java.util.Date;

import org.json.JSONObject;
import org.json.JSONArray;

import com.cetiti.hcms.model.AccelerateBrakeNum;
import com.cetiti.vms.gisbase.utils.TimeUtil;

/**
 * 〈一句话功能简述〉
 * 〈功能详细描述〉
 * @author    Zhangpeng
 * @version   VMS V1.0.0, 2014-9-17
 * @see       
 * @since     VMS V1.0.0
 */

public class AccelerateBrakeColumnService
{
    private int columnSize = 20;
    private final String[] columnNames = new String[]{"总次数","急加速","急减速"};
    
    public Object[] getXAxis(List<AccelerateBrakeNum> allList)
    {
        int iSize = allList.size();
        Timestamp timeMin = allList.get(0).getTime();
        Timestamp timeMax = allList.get(iSize-1).getTime();
        
        Object[] secondsDiffMinMaxDateArray = getSecondsDifference(timeMin, timeMax);
        int iSeconds = Integer.valueOf(secondsDiffMinMaxDateArray[0].toString());
        Date minDate = (Date)secondsDiffMinMaxDateArray[1];
        Date maxDate = (Date)secondsDiffMinMaxDateArray[2];
        
        Object[] columnSizeDateFormatArray  = createColumn(iSeconds,minDate,maxDate);
        int iPeriod = Integer.valueOf(columnSizeDateFormatArray[0].toString());
        JSONArray jsonArray = (JSONArray)columnSizeDateFormatArray[1];
        
        String strTimePeriod = getStringTimePeriod(timeMin, timeMax);
        
        return new Object[]{jsonArray,minDate,maxDate,iPeriod,strTimePeriod};
    }
    public JSONArray getYAxis(List<AccelerateBrakeNum> allList,Date minDate,
        Date maxDate,int interval)
    {
        JSONArray jArray = new JSONArray();
        int size = allList.size();
        
        //initialize
        for(int i = 0; i < columnNames.length; i++)
        {
            JSONObject jObject = new JSONObject();
            jObject.put("name", columnNames[i]);
            JSONArray innerArray = new JSONArray();
            for(int j = 0; j < columnSize; j++)
            {
                innerArray.put(j,0);
            }
            jObject.put("data", innerArray);
            jArray.put(jObject);
        }
        
        Date leftDate = new Date();
        Date rightDate = new Date();
        Calendar cal1 = Calendar.getInstance();
        Object[] dateObjects = getIntegerTime(minDate,maxDate,cal1,interval);
        minDate = (Date)dateObjects[0];
        maxDate = (Date)dateObjects[1];
        for(int i = 0; i < size; i++)
        {
            AccelerateBrakeNum abn = allList.get(i);
            Timestamp tempTimestamp = abn.getTime();
            Date tempDate = tempTimestamp;
            for(int j = 0; j < columnSize; j++)
            {
                leftDate.setTime(((minDate.getTime()/1000)+j*interval)*1000);
                rightDate.setTime(((minDate.getTime()/1000)+(j+1)*interval)*1000);
                if(tempDate.after(leftDate) && tempDate.before(rightDate))
                {
                    int total = jArray.getJSONObject(0).getJSONArray("data").getInt(j);
                    total++;
                    jArray.getJSONObject(0).getJSONArray("data").put(j,total);
                    if(abn.getAccelerate() > 0)
                    {
                        int accelerate = jArray.getJSONObject(1).getJSONArray("data").getInt(j);
                        accelerate++;
                        jArray.getJSONObject(1).getJSONArray("data").put(j,accelerate);
                    }
                    else
                    {
                        int brake = jArray.getJSONObject(2).getJSONArray("data").getInt(j);
                        brake++;
                        jArray.getJSONObject(2).getJSONArray("data").put(j,brake);
                    }
                    break;
                }
            }
        }
        
        return jArray;
    }
    
    private Object[] getIntegerTime(Date leftDate, Date rightDate, Calendar cal1, int interval)
    {
        Date leftResultDate = null;
        Date rightResultDate = null;
        
        //minute
        if(interval == 60)
        {
            cal1.setTime(leftDate);
            cal1.set(Calendar.SECOND, 0);
            leftResultDate = cal1.getTime();
            cal1.setTime(rightDate);
            cal1.set(Calendar.MINUTE, cal1.get(Calendar.MINUTE)+1);
            cal1.set(Calendar.SECOND, 0);
            rightResultDate = cal1.getTime();
        }
        //hour
        else if(interval == 60*60)
        {
            cal1.setTime(leftDate);
            cal1.set(Calendar.MINUTE, 0);
            cal1.set(Calendar.SECOND, 0);
            leftResultDate = cal1.getTime();
            cal1.setTime(rightDate);
            cal1.set(Calendar.HOUR_OF_DAY, cal1.get(Calendar.HOUR_OF_DAY)+1);
            cal1.set(Calendar.MINUTE, 0);
            cal1.set(Calendar.SECOND, 0);
            rightResultDate = cal1.getTime();
        }
        //day
        else if(interval == 60*60*24)
        {
            cal1.setTime(leftDate);
            cal1.set(Calendar.HOUR_OF_DAY, 0);
            cal1.set(Calendar.MINUTE, 0);
            cal1.set(Calendar.SECOND, 0);
            leftResultDate = cal1.getTime();
            cal1.setTime(rightDate);
            cal1.set(Calendar.DAY_OF_MONTH, cal1.get(Calendar.DAY_OF_MONTH)+1);
            cal1.set(Calendar.HOUR_OF_DAY, 0);
            cal1.set(Calendar.MINUTE, 0);
            cal1.set(Calendar.SECOND, 0);
            rightResultDate = cal1.getTime();
        }
        //month
        else
        {
            cal1.setTime(leftDate);
            cal1.set(Calendar.DAY_OF_MONTH, 1);
            cal1.set(Calendar.HOUR_OF_DAY, 0);
            cal1.set(Calendar.MINUTE, 0);
            cal1.set(Calendar.SECOND, 0);
            leftResultDate = cal1.getTime();
            cal1.setTime(rightDate);
            cal1.set(Calendar.MONTH, cal1.get(Calendar.MONTH)+1);
            cal1.set(Calendar.DAY_OF_MONTH, 1);
            cal1.set(Calendar.HOUR_OF_DAY, 0);
            cal1.set(Calendar.MINUTE, 0);
            cal1.set(Calendar.SECOND, 0);
            rightResultDate = cal1.getTime();
        }
        return new Object[]{leftResultDate,rightResultDate};
    }
    
    private Object[] getSecondsDifference(Timestamp timeMin,Timestamp timeMax)
    {         
        Date minDate = timeMin;
        Date maxDate = timeMax;
        Long lMin = minDate.getTime();
        Long lMax = maxDate.getTime();
       
        int hours=(int) ((lMax - lMin)/3600000);
        int minutes=(int) (((lMax - lMin)/1000-hours*3600)/60);
        int seconds=(int) ((lMax - lMin)/1000-hours*3600-minutes*60);
        
        seconds = hours*3600+minutes*60+seconds;
        return new Object[]{seconds,minDate,maxDate};
    }
    
    public Object[] createColumn(int totalSeconds,Date minDate,Date maxDate)
    {
        int iPeriod = 0;
        int iColumnSize = 0;
        SimpleDateFormat tempDateFormat = null;
        JSONArray jArray = new JSONArray();
        Date tempDate = new Date();
        Calendar cal = Calendar.getInstance();  
        cal.setTime(minDate);  
        Calendar cal2 = Calendar.getInstance();
        cal2.setTime(maxDate);
        //less than 20 minutes use minute statistic
        if(totalSeconds <= 60*24)
        {
            iPeriod = 60;
            int iMin = cal.get(Calendar.MINUTE);
            int iMax = cal2.get(Calendar.MINUTE);
            iColumnSize = iMax - iMin >= 0 ? iMax - iMin + 1 : iMax-iMin + 61; 
            tempDateFormat = new SimpleDateFormat("HH:mm");
            for(int i = 0; i < iColumnSize; i++)
            {
                tempDate.setTime(((minDate.getTime()/60000) + i*iPeriod/60)*60000);
                String strResult = tempDateFormat.format(tempDate);
                jArray.put(strResult);
            }
        }
        //less than 20 hours use hour statistic
        else if(totalSeconds <= 60*60*24)
        {
            iPeriod = 60*60;
            int iMin = cal.get(Calendar.HOUR_OF_DAY);
            int iMax = cal2.get(Calendar.HOUR_OF_DAY);
            iColumnSize = iMax - iMin >= 0 ? iMax - iMin + 1 : iMax - iMin + 25;
            tempDateFormat = new SimpleDateFormat("HH");
            for(int i = 0; i < iColumnSize; i++)
            {
                tempDate.setTime(((minDate.getTime()/3600000) + i*iPeriod/3600)*3600000);
                String strResult = tempDateFormat.format(tempDate);
                strResult += "时";
                jArray.put(strResult);
            }
        }
        //less than 20 days use day statistic
        else if(totalSeconds <= 60*60*24*27)
        {
            iPeriod = 60*60*24;
            int iMin = cal.get(Calendar.DAY_OF_MONTH);
            int iMax = cal2.get(Calendar.DAY_OF_MONTH);
            int iMaxDays = cal.getActualMaximum(Calendar.DAY_OF_MONTH);
            iColumnSize = iMax - iMin >= 0 ? iMax - iMin + 1: iMax - iMin + 1 + iMaxDays;
            
            tempDateFormat = new SimpleDateFormat("mm-dd");
            for(int i = 0; i < iColumnSize; i++)
            {
                tempDate.setTime(((minDate.getTime()/(24*3600*1000)) + 
                    i*iPeriod/(24*3600))*3600*1000*24);
                String strResult = tempDateFormat.format(tempDate);
                jArray.put(strResult);
            }
        }
        //use month statistic
        else
        {
            iPeriod = 1;
            iColumnSize = 12;
            int iMin = cal.get(Calendar.MONTH);
            int iMax = cal2.get(Calendar.MONTH);
            iColumnSize = iMax - iMin >= 0 ? iMax -iMin + 1: iMax - iMin + 13; 
            tempDateFormat = new SimpleDateFormat("mm");
            for(int i = 0; i < iColumnSize; i++)
            {
                cal.set(Calendar.MONTH, cal.get(Calendar.MONTH));
                tempDate = cal.getTime();
                String strResult = tempDateFormat.format(tempDate);
                strResult += "月";
                jArray.put(strResult);
            }
        }
        setColumnSize(iColumnSize);
        return new Object[]{iPeriod,jArray};
    }
    public String getStringTimePeriod(Timestamp minTimestamp,Timestamp maxTimestamp)
    {
        String strResult = "";
        Object[] timeObjects = getSecondsDifference(minTimestamp, maxTimestamp);
        int iSeconds = Integer.valueOf(timeObjects[0].toString());
        SimpleDateFormat dateFormat = null;
        if(iSeconds <= 60*60*24*27)
        {
            dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        }
        else
        {
            dateFormat = new SimpleDateFormat("yyyy-MM");
        }
        String strMin = dateFormat.format(minTimestamp);
        String strMax = dateFormat.format(maxTimestamp);
        if(strMin.equals(strMax))
        {
            strResult = strMin;
        }
        else
        {
            strResult = strMin + " - " + strMax;
        }
        return strResult;
    }
    public int getColumnSize()
    {
        return columnSize;
    }
    public void setColumnSize(int columnSize)
    {
        this.columnSize = columnSize;
    }
}
