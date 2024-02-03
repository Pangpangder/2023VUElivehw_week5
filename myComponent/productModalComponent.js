export default{
   template:'#productModalComponent',
   props:{
    product:{
        type:Object,//驗證傳入資料是否為物件格式
        default(){
            return {}//預設返回空物件，以避免錯誤
        }
    }
   },
   data(){
    return{
      modal:'',
      qty:1
    }
   },
   mounted(){
    this.modal=new bootstrap.Modal(this.$refs.modal,{
        keyboard: false,
        backdrop: 'static'
      });
   },
   methods:{
    showModal(){
        this.modal.show();
    },
    hideModal(){
        this.modal.hide();
    },
    addToCart(productId,qty){
        this.$emit('addToCart',productId,qty);
        this.hideModal();
    }
   }
};