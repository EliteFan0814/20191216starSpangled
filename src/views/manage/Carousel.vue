<template>
  <div>
    <el-card>
      <el-button type="primary" @click="addCarouselSet">新增轮播图</el-button>

      <el-table :data="tableData" m-b-10>
        <el-table-column label="轮播图" align="center">
          <template slot-scope="{ row }">
            <img :src="row.pic" class="imp">
          </template>
        </el-table-column>
        <el-table-column label="标题" align="center">
          <template slot-scope="{ row }">{{row.title}}</template>
        </el-table-column>
        <el-table-column label="跳转商品ID" align="center">
          <template slot-scope="{ row }">{{row.refId?row.refId:'暂未设置'}}</template>
        </el-table-column>
        <el-table-column label="排序" align="center">
          <template slot-scope="{ row }">{{row.sort}}</template>
        </el-table-column>

        <el-table-column label="操作" align="center" min-width="100">
          <template slot-scope="{row}">
            <el-button size="mini" @click="edit(row)" type="primary">
              编辑
              <i class="el-icon-edit"></i>
            </el-button>
            <el-button size="mini" @click="delCarousel(row.id)" type="danger">
              删除
              <i class="el-icon-delete"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <CarouselEdit v-if="isEditShow" @close="closeDia" :item="item"></CarouselEdit>
  </div>
</template>

<script>
import CarouselEdit from './CarouselEdit'

export default {
  components: {
    CarouselEdit
  },
  created() {
    this.getData()
  },
  data() {
    return {
      item: {},
      isEditShow: false, //新增/编辑轮播图
      tableData: [],
      maxPage: 1,
      nowPage: 1
    }
  },

  watch: {
    nowPage() {
      this.getData()
    }
  },

  methods: {
    getData() {
      this.$http.get('/api/BaseData/Carousel/All').then(res => {
        if (res.success) {
          this.tableData = res.value
        }
      })
    },
    // 跳转商品详情
    // jumpGood(data) {
    //   this.$router.push({
    //     path: '/mallManage/GoodsManage',
    //     query: { data: data }
    //   })
    // },
    filterChange() {
      this.nowPage === 1 ? this.getData() : (this.nowPage = 1)
    },
    edit(row) {
      this.item = row
      this.isEditShow = true
    },
    // 新增轮播图
    addCarouselSet() {
      this.item = {}
      this.isEditShow = true
    },
    delCarousel(id) {
      this.$confirm('确定要删除吗？', '提示？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$http
            .post('/api/BaseData/Carousel/Delete', {
              id: id
            })
            .then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
                this.getData()
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    closeDia(value) {
      this.isEditShow = false
      if (value) this.getData()
    }
  }
}
</script>

<style scoped>
.imp {
  width: 80px;
}
</style>
