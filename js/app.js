import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

let productModal = null;
let delProductModal = null;

createApp({
  
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/api',
      apiPath: 'gary-api',
      products: [],
      isNew: false,
      tempProduct: {
        imagesUrl: [],
      },
    };
  },
  
  mounted() {
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false
    });

    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false
    });

    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    if (token === '') {
      alert('您尚未登入請重新登入。');
      window.location = 'login.html';
    }

    axios.defaults.headers.common.Authorization = token;

    this.getData();
  },

  // 方法
  methods: {
    // 取得資料
    getData(page = 1) {
      const url = `${this.apiUrl}/${this.apiPath}/admin/products?page=${page}`;
      axios.get(url).then((res) => {
        if (res.data.success) {
          this.products = res.data.products;
        } else {
          alert(res.data.message);
        }
      });
    },
    // 更新資料
    updateProduct() {
      let url = `${this.apiUrl}/${this.apiPath}/admin/product`;
      let http = 'post';

      if (!this.isNew) {
        url = `${this.apiUrl}/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        http = 'put';
      }

      axios[http](url, { data: this.tempProduct }).then((res) => {
        if (res.data.success) {
          alert(res.data.message);
          productModal.hide();
          this.getData();
        } else {
          alert(res.data.message);
        }
      });
    },
    // 打開編輯視窗判斷
    openModal(isNew, item) {
      if (isNew === 'new') {
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      } else if (isNew === 'edit') {
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
      } else if (isNew === 'delete') {
        this.tempProduct = { ...item };
        delProductModal.show();
      }
    },
    // 刪除資料
    delProduct() {
      const url = `${this.apiUrl}/${this.apiPath}/admin/product/${this.tempProduct.id}`;

      axios.delete(url).then((res) => {
        if (res.data.success) {
          alert(res.data.message);
          delProductModal.hide();
          this.getData();
        } else {
          alert(res.data.message);
        }
      });
    },
    // 上傳照片
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    },
  },
}).mount('#app');