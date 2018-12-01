function wj_calendar(id, showHeader, showTail){
    this.thirty = [4,6,9,11] //30天月份
    this.thirtyOne = [1,3,5,7,8,10,12] //31天月份
    this.header ='header'
    this.showHeader =  showHeader || 1 //是否补全上个月份天数
    this.tail = 'tail'
    this.showTail=  showTail || 1 //是否补全下个月份天数
    this.year = (new Date()).getFullYear() //当前年份
    this.month = (new Date()).getMonth()+1 //当前月份
    this.id = id //日历ID
    this.data = "" //日历字符串
  }

  //二月天数
  wj_calendar.prototype.february = function(year){
    if (((year % 4)==0) && ((year % 100)!=0) || ((year % 400)==0)) {
        return 29;
      } else {
        return 28; 
      }
  }

  //in_array函数
  wj_calendar.prototype.in_array = function (search,array){
    for(var i in array){
        if(array[i] == search){
            return true;
        }
    }
    return false;
  }

  //将要补全的上个月或者下个月日期数组
  wj_calendar.prototype.completionDayArray = function(year,month,type,days){
     var arr = []
     if(type == this.tail){
        for (var i = 1; i <= days; i++) {
          arr.push(i)
        }
        return arr;
     }
     m = month -1 > 0 ? month-1 : 12

     if(this.in_array(m,this.thirtyOne)){
         for(var i = 32-days;i<=31;i++){
            arr.push(i)
         }
     }else if(this.in_array(m,this.thirty)){
         for(var i = 31-days;i<=30;i++){
            arr.push(i)
         }
     }else{
        var f = this.february(year)
        for(var i = f+1-days;i<=f;i++){
            arr.push(i)
        }
     }
     return arr;
  }

  //当前月的日期数组
  wj_calendar.prototype.monthDayArray = function(year,month){
     var arr = []
     if(this.in_array(month,this.thirtyOne)){
         for(var i = 1;i<=31;i++){
            arr.push(i)
         }
     }else if(this.in_array(month,this.thirty)){
         for(var i = 1;i<=30;i++){
            arr.push(i)
         }
     }else{
        var f = this.february(year)
        for(var i = 1;i<=f;i++){
            arr.push(i)
        }
     }
     return arr;
  }

  //计算将要补全的上个月和下个月的天数
  wj_calendar.prototype.completionDay = function(year, month){
     var arr = []
     var footer = 0;
     arr[this.header] = 0
     arr[this.tail] = 0;

     arr[this.header] = new Date(year+"-"+month+"-01").getDay()
     if(this.in_array(month,this.thirtyOne)){
       footer = 31;
     }else if(this.in_array(month,this.thirty)){
       footer = 30;
     }else{
        footer = this.february(year)
     }
     arr[this.tail]   = 6-(new Date(year+"-"+month+"-"+footer).getDay())
     return arr;
  }

  //最终数据集合
  wj_calendar.prototype.getDayArray = function(year, month){
      year =  year || this.year;
      month = month || this.month;
      year = parseInt(year)
      month = parseInt(month)
      var a = this.completionDay(year,month)
      var all=[],top =[],middle=[],footer=[]
      var check = function(v,s){
          if(!s){
              var vv = []
              for (var i = 0; i < v.length; i++) {
                vv[i] = ''
              }
              return vv;
          }
          return v;
      }
      if(a[this.header] > 0){
        top = this.completionDayArray(year,month,this.header,a[this.header])
      }
      top = check(top,this.showHeader)
      middle = this.monthDayArray(year, month)
      if(a[this.tail] > 0){
        footer = this.completionDayArray(year,month,this.tail,a[this.tail])
      }
      footer = check(footer,this.showTail)

      all = (top.concat(middle)).concat(footer)
      return all
  }

  //往模板中塞数据，模板自定义
  wj_calendar.prototype.template = function(dayArray,func){
      this.data = func(dayArray);
  }

  //渲染
  wj_calendar.prototype.renderHtml = function(){
      document.getElementById(this.id).innerHTML = this.data
  }

  //上个月
  wj_calendar.prototype.lastMonth = function(func,nowYear,nowMonth){
       nowYear = nowYear || this.year
       nowMonth = nowMonth || this.month
       var y=0,m=0
       if(nowMonth == 1){
          m = 12;
          y = parseInt(nowYear) - 1;
       }else{
          y = parseInt(nowYear);
          m = parseInt(nowMonth) - 1;
       }
       var dayArray = this.getDayArray(y,m)
       this.template(dayArray,func)
       this.renderHtml()
       this.year = y
       this.month = m
  }

  //下个月
  wj_calendar.prototype.nextMonth = function(func,nowYear, nowMonth){
       nowYear = nowYear || this.year
       nowMonth = nowMonth || this.month
       var y=0,m=0
       if(nowMonth == 12){
          y =  parseInt(nowYear) + 1
          m = 1
       }else{
          y = parseInt(nowYear)
          m = parseInt(nowMonth) + 1
       }
       var dayArray = this.getDayArray(y,m)
       this.template(dayArray,func)
       this.renderHtml()
       this.year = y
       this.month = m
  }

  //当前月
  wj_calendar.prototype.nowMonth = function(func,nowYear, nowMonth){
       nowYear = nowYear || this.year
       nowMonth = nowMonth || this.month
       var dayArray = this.getDayArray(nowYear,nowMonth)
       this.template(dayArray,func)
       this.renderHtml()
  }