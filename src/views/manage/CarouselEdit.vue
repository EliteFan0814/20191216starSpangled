<template>
  <!-- <el-card> -->
    <el-dialog iconClass="el-icon-info" :title="item.id?'编辑轮播图':'新增轮播图'" width="500px" :visible.sync="isDialog" 
    :close-on-click-modal="false" @close="close">
      <el-form :model="innerItem" :rules="rules" ref="innerItem" label-position="right" label-width="100px">
        <el-form-item label="标题：" prop="title">
          <el-input v-model="innerItem.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="跳转商品：" prop="refId">
          <el-autocomplete class="inline-input" v-model="searchGoodName" :fetch-suggestions="querySearch" placeholder="请输入商品名" 
          :trigger-on-focus="false" @select="handleSelect"></el-autocomplete>
        </el-form-item>

        <el-form-item label="权重：" prop="sort">
          <el-slider class="leixing" :max="255" v-model="innerItem.sort" show-input></el-slider>
        </el-form-item>
        <el-form-item label="缩略图：" prop="pic">
          <el-upload action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :http-request="uploadSectionFile">
            <div class="src" v-if="innerItem.pic">
              <img :src="innerItem.pic" class="avatar">
            </div>
            <div class="img" v-else>
              <span>点击图片重新上传</span>
            </div>
          </el-upload>
          <span class="test1">提示: 请选择(宽: 640, 高: 320) 的图片</span>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type @click="isDialog = false">取消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  <!-- </el-card> -->
</template>

<script>
// import { constants } from 'crypto'
export default {
  props: ['item'],
  data() {
    return {
      searchPage: 1,
      searchPageSize: 10000,
      searchList: [],
      searchGoodName: '',
      chanpin: [],
      isDialog: true,
      innerItem: {
        id: '',
        title: '',
        pic: '',
        sort: 0,
        module: '',
        refId: '',
        hostPic: ''
      },
      rules: {
        title: [{ required: true, message: '请输入标题!' }],
        refId: [{ required: false, message: '请选择跳转对象!' }],
        pic: [{ required: true, message: '请上传缩略图!' }]
      }
    }
  },
  created() {
    if (this.item.id) {
      this.innerItem = JSON.parse(JSON.stringify(this.item))
      if (this.item.refId) {
        this.$http
          .get('/api/Goods/GetOne', {
            params: {
              goodsId: this.item.refId
            }
          })
          .then(res => {
            if (res.success) {
              this.searchGoodName = res.value.name
            }
          })
      }
    }
  },
  methods: {
    querySearch(queryString, callback) {
      this.$http
        .get('/api/Goods/GoodsList', {
          params: {
            page: this.searchPage,
            pageSize: this.searchPageSize,
            SearchKey: queryString
          }
        })
        .then(res => {
          if (res.success) {
            this.searchList = res.value.data
            for (let i of this.searchList) {
              i.value = i.name
            }
            callback(this.searchList)
          }
        })
    },
    handleSelect(item) {
      this.innerItem.refId = item.id
      this.searchGoodName = item.name
    },
   
    close() {
      this.$emit('close')
    },

    // 图片上传函数
    uploadSectionFile: function(param) {
      var fileObj = param.file
      var form = new FormData()
      form.append('files', fileObj)
      this.$http
        .post('/api/Files/UploadFiles?isPublic=true', form)
        .then(res => {
          this.innerItem.pic = res.pathList[0]
        })
    },

    submit() {
      this.$refs.innerItem.validate(valid => {
        if (!valid) return
        let params = new FormData()
        if (this.innerItem.id) {
          params.append('id', this.innerItem.id)
        }
        params.append('title', this.innerItem.title)
        params.append('pic', this.innerItem.pic)
        params.append('module', this.innerItem.module)
        params.append('sort', this.innerItem.sort)
        params.append('refId', this.innerItem.refId)
        if (this.innerItem.id) {
          this.$http.post('/api/BaseData/Carousel/Modify', params).then(res => {
            if (res.success) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.$emit('close', '1')
            }
          })
        } else {
          this.$http.post('/api/BaseData/Carousel/Add', params).then(res => {
            if (res.success) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.$emit('close', '1')
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader {
  margin-left: 20px;
}
.avatar {
  width: 80%;
  height: 60%;
}
.u_editor {
  height: 500px;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 200px;
  line-height: 200px;
  text-align: center;
}
.leixing {
  width: 90%;
}
.duixiang {
  width: 80%;
}
.img {
  width: 150px;
  height: 150px;
  border: 1px dashed black;
  line-height: 150px;
}
img {
  width: 200px;
  height: 200px;
  cursor: pointer;
}
.src {
  width: 200px;
  height: 200px;
}
.test1 {
  font-size: 10px;
}
</style>

