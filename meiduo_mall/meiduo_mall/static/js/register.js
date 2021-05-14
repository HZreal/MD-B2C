// 采用ES6语法
// 前端页码注册校验逻辑步骤：
//         1.导入Vue.js库和ajax请求的库
//         2.准备div盒子标签，注明id选择器
//         3.准备js文件(即本文件)，前端校验逻辑(点击事件，获取/失去焦点，数据绑定完成再显示)
//         4.html页面绑定变量、事件等，即在html文件标签中添加实际需求的属性
//         5.js文件定义变量、事件等，实现逻辑

let vm = new Vue({
    el: '#app',
    delimiters: ['[[', ']]'],                       // 修改Vue变量的读取语法，避免和jinja2模板语法冲突，后端模板变量用{{  }}
    data: {

        //v-model 接收用户输入信息
        username: '',
        password: '',
        password2: '',
        mobile: '',
        allow: '',
        image_code: '',
        image_code_url: '',           // img标签动态的url地址
        uuid: '',

        //v-show 错误信息默认不显示
        error_name: false,
        error_password: false,
        error_password2: false,
        error_mobile: false,
        error_image_code: false,
        error_allow: false,

        //error_message 错误提示信息若是固定的，可以使用绑定的变量动态的展示错误提示信息，若固定的直接在标签中写死
        error_name_message: '',
        error_mobile_message: '',
        error_image_code_message: '',

    },

    // vm在渲染标签之后就会执行(vm作用域内，此处作用整个页面)
    mounted(){
        //调用生成图形验证码函数
        this.generate_image_code();
    },

    methods: {
        // 生成图形验证码，封装成函数易复用，方便页面加载时调用，点击时也调用
        // 这里实际是vue调用commen.js生成uuid给img标签的src属性赋值，然后自动发送请求到后端，让后端生成验证码并返回
        generate_image_code(){
            this.uuid = generateUUID();
            this.image_code_url = '/image_codes/' + this.uuid + '/';                // img标签的src属性一被赋予链接地址就会自动发送请求，无需手动发送
        },

        // 校验用户名
        // test()方法 检查字符串是否与给出的正则表达式模式相匹配，匹配成功返回true，否则返回 false
        check_username(){
            let re = /^[a-zA-Z][0-9a-zA-Z_]{4,19}$/;                       // 首位只能是字母，总长5-20位
            if(re.test(this.username)){                                    // 校验格式
                this.error_name = false;

                // 用户输入的用户名格式合法，才去发送axios请求给后端判断是否重复
                let url = '/usernames/' + this.username + '/count/'
                axios.get(url, {
                    responseType: 'json',
                }).then((response) => {
                    // console.log(response);
                    console.log(typeof(response.data));
                    count = response.data.count;                   // data是一个对象
                    if(count == 1){
                        this.error_name_message = '用户名已存在';
                        this.error_name = true;
                    }
                    else {
                        this.error_name = false;
                    }
                }).catch((error) => {
                    console.log(error)
                });

            }
            else {
                this.error_name_message = '请输入5-20位字符的用户名，首位只能是字母';
                this.error_name = true;
            }
        },

        // 校验密码
        check_password(){
            let re = /^[A-Za-z][A-Za-z0-9]{7,19}$/;                       //首位非数字，总长8-20位
            // if(re.test(this.password)){
            //     this.error_password = false;
            // }else {
            //     this.error_password = true;
            // }
            this.error_password = !re.test(this.password);               //简写
        },

        // 校验确认密码
        check_password2(){
            // if(this.password2 == this.password){
            //     this.error_password2 = false;
            // }
            // else {
            //     this.error_password2 = true;
            // }
            this.error_password2 = this.password2 !== this.password;      //简写
        },

        // 校验手机号
        check_mobile(){
            let re = /^1[34578]\d{9}$/;
            if(re.test(this.mobile)){
                this.error_mobile = false;

                // 手机号格式合法，则发送axios请求给后端，判断手机号是否重复
                let url = '/mobiles/' + this.mobile + '/count/'
                axios.get(url, {
                    responseType: 'json',
                }).then((response) => {
                    count = response.data.count;
                    if(count == 1){
                        this.error_mobile_message = '手机号已存在';
                        this.error_mobile = true;
                    }
                    else {
                        this.error_mobile = false;
                    }
                }).catch((error) => {
                    console.log(error)
                });

            }
            else {
                this.error_mobile_message = '您输入的手机号格式不正确'
                this.error_mobile = true;
            }
        },

        // 校验图形验证码
        check_image_code(){
            if(this.image_code.length !== 4){                             // 校验格式
                this.error_image_code_message = '请输入图形验证码';
                this.error_image_code = true;
            }else {
                this.error_image_code = false;
            }

        },

        // 校验是否勾选协议
        check_allow(){
            // if(this.allow){               // 勾选与没勾选就是存在不存在
            //     this.error_allow = false;
            // }
            // else {
            //     this.error_allow = true;
            // }
            this.error_allow = !this.allow;
        },

        // 监听表单提交事件
        on_submit(){
            // 对用户全部输入信息校验，刷新获取最新的错误状态
            this.check_username();
            this.check_password();
            this.check_password2();
            this.check_mobile();
            this.check_allow();
            // 判断只要有一个错误，则拒绝提交
            if(this.error_name == true || this.error_password == true || this.error_password2 == true || this.error_mobile == true || this.error_allow == true){
                window.event.returnValue = false;
            }
        },


    },


});