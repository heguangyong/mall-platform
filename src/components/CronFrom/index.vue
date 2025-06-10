<template>
  <div class="cron-form">
    <el-form :model="cronForm" label-width="100px">
      <!-- 执行频率选择 -->
      <el-form-item label="执行频率">
        <el-select v-model="cronForm.type" @change="handleTypeChange">
          <el-option label="每分钟" value="minute" />
          <el-option label="每小时" value="hour" />
          <el-option label="指定小时" value="specificHour" />
          <el-option label="每天" value="day" />
          <el-option label="指定日期" value="specificDay" />
          <el-option label="每周" value="week" />
          <el-option label="每月" value="month" />
          <el-option label="自定义" value="custom" />
        </el-select>
      </el-form-item>

      <!-- 指定小时选择 -->
      <el-form-item v-if="cronForm.type === 'specificHour'" label="指定小时">
        <el-time-picker
            v-model="cronForm.specificTime"
            format="HH:mm"
            placeholder="选择时间"
            @change="handleSpecificHourChange"
        />
      </el-form-item>

      <!-- 指定日期的时间选择 -->
      <template v-if="cronForm.type === 'specificDay'">
        <el-form-item label="日期">
          <el-input-number v-model="cronForm.day" :min="1" :max="31" @change="handleSpecificDayChange" />
        </el-form-item>
        <el-form-item label="时间">
          <el-time-picker
              v-model="cronForm.specificTime"
              format="HH:mm"
              placeholder="选择时间"
              @change="handleSpecificDayChange"
          />
        </el-form-item>
      </template>

      <!-- 每周选择 -->
      <el-form-item v-if="cronForm.type === 'week'" label="星期">
        <el-select v-model="cronForm.weekDay" @change="handleWeekChange">
          <el-option v-for="i in 7" :key="i" :label="weekDayMap[i]" :value="i" />
        </el-select>
      </el-form-item>

      <!-- 自定义表达式输入 -->
      <el-form-item v-if="cronForm.type === 'custom'" label="表达式">
        <el-input
            v-model="cronForm.expression"
            placeholder="请输入cron表达式"
            @input="handleCustomInput"
        />
        <div class="cron-tips">格式：秒 分 时 日 月 周</div>
      </el-form-item>

      <!-- 表达式显示 -->
      <el-form-item>
        <div class="cron-result">
          当前表达式：{{ cronExpression }}
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CronForm",
  props: {
    value: {
      type: String,
      default: '* * * * * ?'
    }
  },
  data() {
    return {
      weekDayMap: {
        1: '星期日',
        2: '星期一',
        3: '星期二',
        4: '星期三',
        5: '星期四',
        6: '星期五',
        7: '星期六'
      },
      cronForm: {
        type: 'minute',
        expression: '* * * * * ?',
        specificTime: null,
        weekDay: 1,
        day: 1
      }
    }
  },
  computed: {
    cronExpression() {
      return this.cronForm.expression
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.parseCronExpression(val)
      }
    }
  },
  methods: {
    // 处理类型变化
    handleTypeChange(type) {
      switch(type) {
        case 'minute':
          this.cronForm.expression = '* * * * * ?'
          break
        case 'hour':
          this.cronForm.expression = '0 0 * * * ?'
          break
        case 'day':
          this.cronForm.expression = '0 0 0 * * ?'
          break
        case 'week':
          this.cronForm.expression = '0 0 0 ? * 1'
          break
        case 'month':
          this.cronForm.expression = '0 0 0 1 * ?'
          break
        case 'specificHour':
        case 'specificDay':
          // 保持当前表达式不变，等待具体时间选择
          break
      }
      this.emitChange()
    },

    // 处理指定小时变化
    handleSpecificHourChange(time) {
      if (!time) return
      const hours = time.getHours()
      const minutes = time.getMinutes()
      this.cronForm.expression = `0 ${minutes} ${hours} * * ?`
      this.emitChange()
    },

    // 处理指定日期变化
    handleSpecificDayChange() {
      if (!this.cronForm.specificTime) return
      const hours = this.cronForm.specificTime.getHours()
      const minutes = this.cronForm.specificTime.getMinutes()
      this.cronForm.expression = `0 ${minutes} ${hours} ${this.cronForm.day} * ?`
      this.emitChange()
    },

    // 处理周几变化
    handleWeekChange(weekDay) {
      this.cronForm.expression = `0 0 0 ? * ${weekDay}`
      this.emitChange()
    },

    // 处理自定义输入
    handleCustomInput(value) {
      this.emitChange()
    },

    // 触发变更事件
    emitChange() {
      this.$emit('input', this.cronForm.expression)
      this.$emit('change', this.cronForm.expression)
    },

    // 解析cron表达式
    parseCronExpression(expression) {
      if (!expression) return

      const parts = expression.split(' ')
      if (parts.length !== 6) return

      const [second, minute, hour, day, month, week] = parts

      // 解析不同类型的表达式
      if (expression === '* * * * * ?') {
        this.cronForm.type = 'minute'
      } else if (expression === '0 0 * * * ?') {
        this.cronForm.type = 'hour'
      } else if (expression === '0 0 0 * * ?') {
        this.cronForm.type = 'day'
      } else if (expression === '0 0 0 1 * ?') {
        this.cronForm.type = 'month'
      } else if (week !== '?' && day === '?') {
        this.cronForm.type = 'week'
        this.cronForm.weekDay = parseInt(week)
      } else if (second === '0' && day !== '*' && day !== '?' && week === '?') {
        this.cronForm.type = 'specificDay'
        this.cronForm.day = parseInt(day)
        const date = new Date()
        date.setHours(parseInt(hour))
        date.setMinutes(parseInt(minute))
        this.cronForm.specificTime = date
      } else if (second === '0' && day === '*' && week === '?' && (hour !== '*' || minute !== '*')) {
        this.cronForm.type = 'specificHour'
        const date = new Date()
        date.setHours(parseInt(hour))
        date.setMinutes(parseInt(minute))
        this.cronForm.specificTime = date
      } else {
        this.cronForm.type = 'custom'
      }

      this.cronForm.expression = expression
    }
  }
}
</script>

<style scoped>
.cron-form {
  padding: 20px;
}
.cron-tips {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}
.cron-result {
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}
</style>