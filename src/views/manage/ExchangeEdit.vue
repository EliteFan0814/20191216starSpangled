<template>
  <el-dialog :title="item.id?'编辑当前商品':'添加商品'" :visible.sync="isDialog" :close-on-click-modal="false" width="950px" center @close="close">
    <el-form :model="innerItem" ref="innerItem" :rules="rules" label-position="right" label-width="150px">
      <el-form-item label="商品名称：" prop="name">
        <el-input class="inp" placeholder="请输入名称" v-model="innerItem.name"></el-input>
      </el-form-item>
      <el-form-item label="零售价：" prop="retailPrice">
        <el-input class="inp" placeholder="请输入零售价" v-model="innerItem.retailPrice"></el-input>
      </el-form-item>
      <el-form-item label="商品图片：" prop="thumb">
        <el-upload action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :http-request="uploadSectionFile">
          <img v-if="innerItem.thumb" :src="innerItem.thumb" class="avatar img">
          <i v-else class="myiclass">点击上传图片</i>
        </el-upload>
      </el-form-item>
      <el-form-item label="图文详情：" prop="content">
        <Editor id="tinymce" :content="innerItem.content" @changed="(value)=>{innerItem.content=value}" class="quillEditor"></Editor>
      </el-form-item>
    </el-form>
    <div slot="footer" align="center" class="dialog-footer">
      <el-button @click="isDialog= false">取 消</el-button>
      <el-button type="primary" @click="submit('item')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Editor from '@/components/RichText'

export default {
  components: {
    Editor
  },
  props: ['item'],
  data() {
    return {
      isDialog: true,
      innerItem: {
        name: '',
        retailPrice: '',
        thumb: '',
        content: ''
      },
      rules: {
        name: [{ required: true, message: '请输入商品名称' }],
        retailPrice: [{ required: true, message: '请输入零售价' }],
        thumb: [{ required: true, message: '请上传缩略图' }],
        content: [{ required: true, message: '请编写商品详情' }]
      }
    }
  },
  created() {
    if (this.item.id) {
      this.innerItem = JSON.parse(JSON.stringify(this.item))
    }
  },
  methods: {
    // getData() {
    //   this.$http
    //     .get('/api/Goods/GetOne', {
    //       params: {
    //         goodsId: this.item.id
    //       }
    //     })
    //     .then(res => {
    //       this.item = res.value
    //     })
    // },

    uploadSectionFile: function(param) {
      var fileObj = param.file
      var form = new FormData()
      form.append('files', fileObj)
      this.$http
        .post('/api/Files/UploadFiles?isPublic=true', form)
        .then(res => {
          this.innerItem.thumb = res.pathList[0]
        })
    },
    close() {
      this.$emit('close')
    },
    submit() {
      this.$refs.innerItem.validate(valid => {
        if (!valid) return
        let params = new FormData()
        if (this.innerItem.id) {
          params.append('id', this.innerItem.id)
        }
        params.append('Name', this.innerItem.name)
        params.append('RetailPrice', this.innerItem.retailPrice)
        params.append('Thumb', this.innerItem.thumb)
        params.append('Content', this.innerItem.content)
        if (this.innerItem.id) {
          this.$http.post('/api/Goods/Modify', params).then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.$emit('close', '1')
            }
          })
        } else {
          this.$http.post('/api/Goods/Create', params).then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '添加成功!'
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
img {
  width: 200px;
  height: 200px;
  cursor: pointer;
}
.inp {
  width: 90%;
}
.quillEditor {
  margin-bottom: 100px;
  height: 400px;
  width: 700px;
}
.myiclass {
  width: 150px;
  height: 150px;
  line-height: 150px;
  border: 1px dashed black;
  display: block;
}
</style>



