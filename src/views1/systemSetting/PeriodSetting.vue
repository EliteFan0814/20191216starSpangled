<template>
  <div>
    <el-card>
      <div class="body">
        <div v-for="item in tableData"
          class="block">
          <div class="itemC">
            <div class="setText">
              <span class="demonstration">{{item.name}}：</span>
              <span class="itemExplain">({{item.remark}})</span>
            </div>
            <el-slider v-model="item.value"
              class="slid"
              show-input></el-slider>
          </div>
        </div>
        <div class="end"
          slot="footer">
          <el-button type="primary"
            @click="submit">保 存</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      innerSystemStr: [],
      item: [{ name: 'haha', number: 2 }, { name: 'haha', number: 2 }]
    }
  },
  computed: {
    postSystemStr() {
      let innerPostSystemStr = []
      for (let i = 0; i < this.tableData.length; i++) {
        let j = {}
        j.code = this.tableData[i].code
        j.value = this.tableData[i].value
        innerPostSystemStr.push(j)
      }
      return innerPostSystemStr
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.$http.get('/api/SystemSetting/List').then(res => {
        let systemStr = res.value
        for (let i = 0; i < systemStr.length; i++) {
          if (systemStr[i].code.indexOf('period_') !== -1) {
            this.innerSystemStr.push(systemStr[i])
          }
        }
        this.tableData = this.innerSystemStr
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].value = Number(this.tableData[i].value)
        }
      })
    },
    submit() {
      this.$confirm('确认保存修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post('/api/SystemSetting/SystemModify', {
              modifySettings: this.postSystemStr
            })
            .then(res => {
              if (res.success) {
                this.$message({
                  message: '修改成功！',
                  type: 'success'
                })
              }
            })
        })
        .catch(err => {
          this.innerSystemStr = []
          this.getData()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.block {
  width: 700px;
  padding: 10px;
  border-bottom: 1px solid #f5f5f5;
  .itemC {
    display: flex;
    justify-content: center;
    align-items: center;
    // border: 1px solid red;
    .setText{
      display: flex;
      flex-direction: column;
      // border: 1px solid green;
      width: 40%;
      .itemExplain{
        font-size: 12px;
      }
    }
  }
}
.slid {
  float: right;
  width: 60%;
}
.end {
  margin-top: 20px;
  text-align: right;
  width: 700px;
}
</style>