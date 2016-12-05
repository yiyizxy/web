window.onload=function(){
//页面加载时执行
    waterfall('main','pin');
//固定图片加载完之后，滑动滚动条得到瀑布流效果
    var dataInt={'data':[{'src':'1.jpg'},{'src':'2.jpg'},{'src':'3.jpg'},{'src':'4.jpg'}]};    
    window.onscroll=function(){
        if(checkscrollside()){
            var oParent = document.getElementById('main');
            for(var i=0;i<dataInt.data.length;i++){
                var oPin=document.createElement('div'); 
                oPin.className='pin';                   
                oParent.appendChild(oPin);            
                var oBox=document.createElement('div');
                oBox.className='box';
                oPin.appendChild(oBox);
                var oImg=document.createElement('img');
                oImg.src='./images/'+dataInt.data[i].src;
                oBox.appendChild(oImg);
            }
            waterfall('main','pin');
        };
    }
}
//对第一行中高度最低的图片进行添加新图片，采用offsetHeight、offsetLeft
function waterfall(parent,pin){
    var oParent=document.getElementById(parent);
    var aPin=getClassObj(oParent,pin);// 获取子元素数组
    var iPinW=aPin[0].offsetWidth;
// document.documentElement.scrollWidth返回整个文档的宽度
// document.documentElement.offsetWidth返回整个文档的可见宽度
// document.documentElement.clientwidth返回整个文档的可见宽度（不包含边框),），clientwidth = offsetWidth - borderWidth
    var num=Math.floor(document.documentElement.clientWidth/iPinW);
    oParent.style.cssText='width:'+iPinW*num+'px;margin:0 auto;';
    var pinHArr=[];
    for(var i=0;i<aPin.length;i++){
        var pinH=aPin[i].offsetHeight;
        if(i<num){
            pinHArr[i]=pinH;
        }else{
            var minH=Math.min.apply(null,pinHArr);//数组pinHArr中的最小值minH
            var minHIndex=getminHIndex(pinHArr,minH);
            aPin[i].style.position='absolute';
            aPin[i].style.top=minH+'px';
            aPin[i].style.left=aPin[minHIndex].offsetLeft+'px';
            pinHArr[minHIndex]+=aPin[i].offsetHeight;//更新添加了块框后的列高
        }
    }
}
// 获取父类子元素的数组   
function getClassObj(parent,className){
    var obj=parent.getElementsByTagName('*');
    var pinS=[];
    for (var i=0;i<obj.length;i++) {
        if (obj[i].className==className){
            pinS.push(obj[i]);
        }
    };
    return pinS;
}
// 获取图片高度最小值的索引index   
function getminHIndex(arr,minH){
    for(var i in arr){
        if(arr[i]==minH){
            return i;
        }
    }
}
//滚动条效果
function checkscrollside(){
    var oParent=document.getElementById('main');
    var aPin=getClassObj(oParent,'pin');
    var lastPinH=aPin[aPin.length-1].offsetTop+Math.floor(aPin[aPin.length-1].offsetHeight/2);//创建【触发添加块框函数waterfall()】的高度：最后一个块框的距离网页顶部+自身高的一半(实现未滚到底就开始加载)
    var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;//解决兼容性
    var documentH=document.documentElement.clientHeight;//页面高度
    return (lastPinH<scrollTop+documentH)?true:false;//到达指定高度后返回true
}