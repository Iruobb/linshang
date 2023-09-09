// 自动登录密码
var password = "aaaaaaaa"; 
//止损点数
var limitlossvalue = 15;

var window = floaty.window(
    <frame>
        <vertical>
            <horizontal>
                <button id="action" text="价格" w="60" h="40" bg="#ff3300" textColor="#ffffff" />
                <button id="actionstart" text="增减" w="60" h="40" bg="#0000cc" textColor="#ffffff"/>
            </horizontal> 
        </vertical>
    </frame>
);

window.exitOnClose();

window.actionstart.click(()=>{
    console.log("actionstart click"); 
    if(isbuyer != 0) {
        threads.start(function(){
            var inputtext = id("edt_zorder_price").findOne(100);
            console.log(inputtext.text());
            if(inputtext) {
                var price = parseInt(inputtext.text());          
                price -= isbuyer;
                inputtext.setText("" + price);
            }

            var stoploss = id("edt_zorder_stop_loss").findOne();
            price -= limitlossvalue * isbuyer;
            stoploss.setText("" + price); 
            
        });
    } else {
        console.log(0);
    }
});

window.action.click(()=>{
    console.log("action click");     
    threads.start(function(){
        tradesetting();
    });
});

 
function tradesetting() { 
    var mpp = id("tv_zorder_price").findOne(100);
    var inputtext = id("edt_zorder_price").findOne(100);
    var vaidday = id("edt_zorder_valid_day").findOne(100);
    var mapptext = "";

    if(mpp) {
        mapptext = mpp.text(); 
        inputtext.setText(mapptext);
        vaidday.setText("1");
    }  else {
        if('gnnt.MEBS.espot.m6.lygj' == currentPackage()) {} else {
            app.launchApp('临商中心');
            sleep(500)
        }
    } 

    var bs = id("tv_zorder_bs").findOne(100); 
    if(bs) {
        if(bs.text()=="买") {
            isbuyer = 1; 
        } else {
            isbuyer = -1;
        }
        var stoploss = id("edt_zorder_stop_loss").findOne();
        if(!stoploss.enabled()) {
            text("止损").findOne(100).click();
            sleep(500);      
        } 
        var intmpp = parseInt(mapptext); 

        intmpp -= limitlossvalue * isbuyer;
        stoploss.setText("" + intmpp); 
    }
}

function login() { 
    var codeimg = id("validate_login_codes").findOne();
    console.log(codeimg.bounds());

    images.requestScreenCapture();
    var img = images.captureScreen();
    var res = ocr(img,codeimg.bounds());
 
    var ocrstr = res[0];
    ocrstr = ocrstr.replace(/ /g,"");
    console.log(ocrstr);
    id("edt_login_codes").findOne().setText(ocrstr);
 
    sleep(500);
    id("edt_login_password").findOne().setText(password);
    sleep(500);
    if(ocrstr.length == 4) {
        id("tv_login").findOne().click();
    }
}

window.setPosition(device.width-360,device.height-690);

var iscurrent = false;
var istradewindow = false;
var isbuyer = 0;

//页面监控
threads.start(function(){
    while(true) {
        if('gnnt.MEBS.espot.m6.lygj' == currentPackage()) {
            if(!iscurrent) {
                console.log("show window");
                window.setPosition(device.width-360,device.height-690);
            }
            iscurrent = true;
            
            if(text("摘牌价").findOne(100) && text("摘牌价").findOne(100)) {
                istradewindow = true;         
            } else {
                istradewindow = false;
                isbuyer = 0;
            }
            if(text("登录").findOne(100)) {
                    login();
            } 
                
        } else {

            iscurrent = false;
            window.setPosition(device.width - 90,device.height-690);
        }
        sleep(500);
    }
 
});

setInterval(()=>{}, 1000);
