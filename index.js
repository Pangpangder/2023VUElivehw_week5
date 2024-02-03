import productModalComponent from './myComponent/productModalComponent.js';//引入’查看更多‘的modal元件
const {createApp}=Vue;//引入createApp方法

const {Form,Field,ErrorMessage,defineRule,configure}=VeeValidate;//以解構的方式取出VeeValidate中要用到的屬性及方法
const {required, email, min, max}=VeeValidateRules;//以解構的方式取出VeeValidateRules中要用到的驗證規則
const {loadLocaleFromURL,localize}=VeeValidateI18n;//以解構的方式取出VeeValidateI18n中要用到的方法

//定義驗證規則
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

//加入繁中語系
loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');
configure({
  generateMessage: localize('zh_TW'),
});

//設定api路徑及名稱
const apiUrl = 'https://ec-course-api.hexschool.io/v2';
const apiPath = 'pangpang';

//根元件
const app=createApp({
  data(){
    return{
        products:[],
        product:{},
        loadingStatus:{
          loadingItem:''
        },
        carts:{},
        form: {
          user: {
            name: '',
            email: '',
            tel: '',
            address: '',
          },
          message: '',
        },
        isLoading:true
    }
  },
  components:{
    VForm:Form,
    VField:Field,
    ErrorMessage:ErrorMessage
  },
  methods:{
    getAllProducts(){
     const url = `${apiUrl}/api/${apiPath}/products`;
     axios.get(url)
     .then((res)=>{
       this.products=res.data.products;
       this.isLoading=false;
     })
     .catch((err)=>{
      console.dir(err);
      alert('出錯啦!!');
     });
    },
    getProductDetail(productId){
     const url=`${apiUrl}/api/${apiPath}/product/${productId}`;
     this.loadingStatus.loadingItem=productId;
     axios.get(url)
     .then((res)=>{
       this.loadingStatus.loadingItem='';
       this.product=res.data.product;
       this.$refs.productModalComponent.showModal();
     })
     .catch((err)=>{
      console.dir(err);
      alert('出錯啦!!');
     });
    },
    addToCart(productId,qty=1){
      const url=`${apiUrl}/api/${apiPath}/cart`;
      this.loadingStatus.loadingItem=productId;
      const obj={
        data:{
          product_id:productId,
          qty
        }
      };
      axios.post(url,obj)
      .then((res)=>{
         this.loadingStatus.loadingItem='';
         alert(res.data.message);
         this.getCartList();
      })
      .catch((err)=>{
       console.dir(err);
       alert('出錯啦!!');
      });
    },
    getCartList(){
      const url=`${apiUrl}/api/${apiPath}/cart`;
      axios.get(url)
      .then((res)=>{
        this.carts=res.data.data;
      })
      .catch((err)=>{
        console.dir(err);
        alert('出錯啦!!');
      });
    },
    deleteCartItem(dataObj){
     const url=`${apiUrl}/api/${apiPath}/cart/${dataObj.id}`;
     this.loadingStatus.loadingItem = dataObj.id;
     axios.delete(url)
     .then((res)=>{
      this.loadingStatus.loadingItem = '';
      alert(res.data.message);
      this.getCartList();
     })
     .catch((err)=>{
      console.dir(err);
      alert('出錯啦!!');
     });
    },
    deleteCartAll(){
      const url=`${apiUrl}/api/${apiPath}/carts`
      axios.delete(url)
      .then((res)=>{
       alert(res.data.message);
       this.getCartList();
      })
      .catch((err)=>{
        console.dir(err);
        alert('出錯啦!!');
      });
    },
    editCartItemNum(dataObj){
      this.loadingStatus.loadingItem = dataObj.id;
      const url = `${apiUrl}/api/${apiPath}/cart/${dataObj.id}`;
      const obj={
       data:{
        "product_id": dataObj.product_id,
        "qty": dataObj.qty
       }
      };
      axios.put(url,obj)
       .then((res)=>{
       alert(res.data.message);
       this.loadingStatus.loadingItem = '';
       this.getCartList();
      })
     .catch((err)=>{
      console.dir(err);
      alert('出錯啦!!');
      this.loadingStatus.loadingItem = '';
     });
    },
    sendMyOrder(){
     const url=`${apiUrl}/api/${apiPath}/order`;
     const obj={
      data:this.form
     }
     axios.post(url,obj)
     .then((res)=>{
       alert(res.data.message);
       this.$refs.form.resetForm();
       this.form.message='';
       this.getCartList();
     })
     .catch((err)=>{
      console.dir(err);
      alert('出錯啦!!');
     });
    },
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : '需要正確的電話號碼';
    }
  },
  mounted(){
    this.getAllProducts();
    this.getCartList();
  }
});

//modal元件
app.component('productModalComponent',productModalComponent);

//loading元件
app.component('loading',VueLoading.Component);

app.mount('#app');