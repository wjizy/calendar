function wj_calendar(id){
    this.debug = true;
    this.thirty = [4,6,9,11] //30天月份
    this.thirtyOne = [1,3,5,7,8,10,12] //31天月份
    this.header ='header'
    this.showHeader =  1 //是否补全上个月份天数
    this.tail = 'tail'
    this.showTail=  1 //是否补全下个月份天数
    this.year = (new Date()).getFullYear() //当前年份
    this.month = (new Date()).getMonth()+1 //当前月份
    this.id = id //日历ID
    this.data = "" //日历字符串
    this.top = []
    this.middle = []
    this.footer=[]
    this.all=[]
    this.allData = []
    this.index=[]
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
        var next = this.next(year, month)
        for (var i = 1; i <= days; i++) {
          this.footer.push(next.y+'-'+this.ii(next.m)+'-'+this.ii(i))
          arr.push(i)
        }
        return arr;
     }
     m = month -1 > 0 ? month-1 : 12

     var last = this.last(year, month)
     if(this.in_array(m,this.thirtyOne)){
         for(var i = 32-days;i<=31;i++){
            arr.push(i)
            this.top.push(last.y+'-'+this.ii(last.m)+'-'+this.ii(i))
         }
     }else if(this.in_array(m,this.thirty)){
         for(var i = 31-days;i<=30;i++){
            arr.push(i)
            this.top.push(last.y+'-'+this.ii(last.m)+'-'+this.ii(i))
         }
     }else{
        var f = this.february(year)
        for(var i = f+1-days;i<=f;i++){
            arr.push(i)
            this.top.push(last.y+'-'+this.ii(last.m)+'-'+this.ii(i))
        }
     }
     return arr;
  }

  wj_calendar.prototype.ii = function(i){
      if(parseInt(i)<10){
         return "0"+i
      }
      return i
  }
  //当前月的日期数组
  wj_calendar.prototype.monthDayArray = function(year,month){
     var arr = []
     if(this.in_array(month,this.thirtyOne)){
         for(var i = 1;i<=31;i++){
            arr.push(i)
            this.middle.push(year+'-'+this.ii(month)+'-'+this.ii(i))
         }
     }else if(this.in_array(month,this.thirty)){
         for(var i = 1;i<=30;i++){
            arr.push(i)
            this.middle.push(year+'-'+this.ii(month)+'-'+this.ii(i))
         }
     }else{
        var f = this.february(year)
        for(var i = 1;i<=f;i++){
            arr.push(i)
            this.middle.push(year+'-'+this.ii(month)+'-'+this.ii(i))
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
      this.top=[]
      this.middle=[]
      this.footer=[]
      this.all=[]
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

      this.allData = (top.concat(middle)).concat(footer)
      this.all = (this.top.concat(this.middle)).concat(this.footer)

     if(this.debug){
        console.log('********页面日期 start ********')
        console.log(this.allData)
        console.log('********页面日期 end ********')

        console.log('********页面年-月-日 start ********')
        console.log(this.all)
        console.log('********页面年-月-日 end ********')
     }
      return this.allData
  }

  //往模板中塞数据，模板自定义
  wj_calendar.prototype.template = function(dayArray,list,func){
      this.data = func(dayArray,list);
      this.containsAll(this.all, list)
  }

  //渲染
  wj_calendar.prototype.renderHtml = function(){
      document.getElementById(this.id).innerHTML = this.data
  }

  //上个月
  wj_calendar.prototype.lastMonth = function(func,list,nowYear,nowMonth){
       nowYear = nowYear || this.year
       nowMonth = nowMonth || this.month
       list = list || []
       var y=0,m=0
       var last= this.last(nowYear, nowMonth)
       y = last.y,m=last.m
       var dayArray = this.getDayArray(y,m)
       this.template(dayArray,list,func)
       this.renderHtml()
       this.year = y
       this.month = m
  }

  //下个月
  wj_calendar.prototype.nextMonth = function(func,list,nowYear, nowMonth){
       nowYear = nowYear || this.year
       nowMonth = nowMonth || this.month
       list = list || []
       var y=0,m=0
       var next = this.next(nowYear, nowMonth)
       y=next.y,m=next.m

       var dayArray = this.getDayArray(y,m)
       this.template(dayArray,list,func)
       this.renderHtml()
       this.year = y
       this.month = m
  }

   wj_calendar.prototype.contains = function(arrays, obj) {
      var i = arrays.length;
      while (i--) {
          if (arrays[i] === obj) {
            return i;
          }
      }
      return null;
  }

  //取下标
  wj_calendar.prototype.containsAll = function(arrays, objs){
     for (var i = 0; i < objs.length; i++) {
       var idx = this.contains(arrays,objs[i])
       if(this.allData[idx] != ''){
         this.index.push(idx)
       }
     }
     if(this.debug){
        console.log('********日程下标 start ********')
        console.log(this.index)
        console.log('********日程下标 end ********')
     }
   }

   //上个月日期
   wj_calendar.prototype.last= function(nowYear, nowMonth){
     var y=0,m=0
     if(nowMonth == 1){
          m = 12;
          y = parseInt(nowYear) - 1;
       }else{
          y = parseInt(nowYear);
          m = parseInt(nowMonth) - 1;
       }
     return {"y":y,"m":m}
  }

  //下个月日期
  wj_calendar.prototype.next= function(nowYear, nowMonth){
     var y=0,m=0
     if(nowMonth == 12){
          y =  parseInt(nowYear) + 1
          m = 1
     }else{
         y = parseInt(nowYear)
         m = parseInt(nowMonth) + 1
      }
     return {"y":y,"m":m}
  }

  //当前月
  wj_calendar.prototype.nowMonth = function(func,list,nowYear, nowMonth){
       nowYear = nowYear || this.year
       nowMonth = nowMonth || this.month
       list = list || []
       var dayArray = this.getDayArray(nowYear,nowMonth)
       this.template(dayArray,list,func)
       this.renderHtml()
  }