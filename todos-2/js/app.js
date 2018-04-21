(function(exports){
    /*
     * 思考：
     *   是否能提供多个方法，实现根据activeState模型的变化，显示不同的内容。
     * */
    var todoFiler ={
        All(){
            // alert('显示所有！');
            return this.todos;
        },
        Active(){
            // alert('显示未完成！');
            return this.todos.filter(function(todo,index){
                return todo.completed === false;
            });
        },
        Completed(){
            // alert('显示已完成！');
            return this.todos.filter(function(todo,index){
                return todo.completed === true;
            });
        }
    };

    // 创建Vue实例
    exports.app = new Vue({
        // 挂载视图
        el : '.todoapp',
        // 绑定数据
        data:{
            // 输入框的新值
            newTitle : '',
            // 列表数组模型
            todos : [], /// AJAX，localStorage
            // 是否为编辑状态，默认为false
            editing : false,
            editIndex : undefined,
            // 添加一个当前显示状态
            activeState : 'All'
        },
        // 方法
        methods:{
            // 添加任务
            addTodo(){
                // 取值,做判断
                if(!this.newTitle)return;
                // alert(this.newTodo);
                // 封装任务对象(“任务标题”和“任务状态”)
                var newTodo = {'title':this.newTitle, 'completed':false};
                // 把任务对象放入列表
                // this.todos.push(newTodo);
                this.todos.unshift(newTodo);

                // 清空输入框
                this.newTitle='';
            },
            // 开始编辑
            startEdit(index){
                this.editing = true;
                this.editIndex =index;
            },
            // 结束编辑
            endEdit(){
                this.editing = false;
                this.editIndex =null;
            },
            // 删除任务
            removeTodo(index){
                this.todos.splice(index,1);
            },
            // 修改状态
            changeState(newState){
                this.activeState = newState;
            }
        },

        // 计算属性
        computed:{
            filterTodos(){
                return todoFiler[this.activeState].call(this); // 修改filter方法内部this执行，为Vue对象
            }
        }
    });


})(window);
