document.addEventListener('DOMContentLoaded', function () {
    // 初始学生数据
    const students = [
        { id: '001', name: '张三', age: 18, math: 85, english: 92, science: 78 },
        { id: '002', name: '李四', age: 19, math: 76, english: 88, science: 90 },
        { id: '003', name: '王五', age: 18, math: 92, english: 95, science: 88 },
        { id: '004', name: '赵六', age: 19, math: 68, english: 72, science: 75 }
    ];

    // 当前编辑的单元格信息
    let currentEdit = {
        element: null,
        studentIndex: -1,
        field: '',
        originalValue: ''
    };

    // 获取DOM元素
    const tableBody = document.querySelector('#student-table tbody');

    // 创建消息提示
    function createMessage(type, content) {
        // 检查是否已存在消息容器
        let container = document.querySelector('.message-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'message-container';
            document.body.appendChild(container);
        }

        // 创建消息元素
        const message = document.createElement('div');
        message.className = `message message-${type}`;

        const messageContent = document.createElement('span');
        messageContent.className = 'message-content';
        messageContent.textContent = content;

        message.appendChild(messageContent);
        container.appendChild(message);

        // 3秒后移除消息
        setTimeout(() => {
            message.classList.add('message-leave');
            setTimeout(() => {
                container.removeChild(message);
                // 如果容器中没有消息了，移除容器
                if (container.children.length === 0) {
                    document.body.removeChild(container);
                }
            }, 300); // 等待动画完成
        }, 3000);
    }

    // 渲染表格
    function renderTable() {
        tableBody.innerHTML = '';

        students.forEach((student, index) => {
            const row = document.createElement('tr');

            // 创建单元格
            const fields = ['id', 'name', 'age', 'math', 'english', 'science'];
            fields.forEach(field => {
                const cell = document.createElement('td');
                cell.textContent = student[field];
                cell.dataset.field = field;
                cell.dataset.index = index;
                cell.addEventListener('click', handleCellClick);
                row.appendChild(cell);
            });

            tableBody.appendChild(row);
        });
    }

    // 处理单元格点击事件
    function handleCellClick(event) {
        const cell = event.target;
        const field = cell.dataset.field;
        const index = parseInt(cell.dataset.index);

        // 如果已经在编辑其他单元格，先保存
        if (currentEdit.element && currentEdit.element !== cell) {
            saveEdit();
        }

        // 设置当前编辑的单元格
        currentEdit.element = cell;
        currentEdit.studentIndex = index;
        currentEdit.field = field;
        currentEdit.originalValue = students[index][field];

        // 创建输入框
        const input = document.createElement('input');
        input.type = (field === 'age' || field === 'math' || field === 'english' || field === 'science') ? 'number' : 'text';
        input.value = currentEdit.originalValue;

        // 设置输入框事件
        input.addEventListener('blur', saveEdit);
        input.addEventListener('keydown', handleInputKeydown);

        // 清空单元格并添加输入框
        cell.textContent = '';
        cell.classList.add('editable-cell');
        cell.appendChild(input);

        // 聚焦输入框
        input.focus();

        // 隐藏错误信息
        hideError();
    }

    // 处理输入框键盘事件
    function handleInputKeydown(event) {
        if (event.key === 'Enter') {
            saveEdit();
        } else if (event.key === 'Escape') {
            cancelEdit();
        }
    }

    // 保存编辑
    function saveEdit() {
        if (!currentEdit.element) return;

        const input = currentEdit.element.querySelector('input');
        if (!input) return;

        const newValue = input.value;
        const field = currentEdit.field;
        const index = currentEdit.studentIndex;

        // 验证输入
        const validationResult = validateInput(field, newValue);

        if (validationResult.valid) {
            // 更新数据
            if (field === 'age' || field === 'math' || field === 'english' || field === 'science') {
                students[index][field] = parseInt(newValue);
            } else {
                students[index][field] = newValue;
            }

            // 恢复单元格
            currentEdit.element.textContent = students[index][field];
            currentEdit.element.classList.remove('editable-cell');

            // 重置当前编辑
            currentEdit = {
                element: null,
                studentIndex: -1,
                field: '',
                originalValue: ''
            };

            hideError();
        } else {
            // 显示错误消息
            createMessage('error', validationResult.message);
            // 重新聚焦输入框
            input.focus();
        }
    }

    // 取消编辑
    function cancelEdit() {
        if (!currentEdit.element) return;

        // 恢复单元格原始值
        currentEdit.element.textContent = currentEdit.originalValue;
        currentEdit.element.classList.remove('editable-cell');

        // 重置当前编辑
        currentEdit = {
            element: null,
            studentIndex: -1,
            field: '',
            originalValue: ''
        };

        hideError();
    }

    // 验证输入
    function validateInput(field, value) {
        if (field === 'name') {
            if (!value.trim()) {
                return { valid: false, message: '姓名不能为空' };
            }
        } else if (field === 'id') {
            if (!value.trim()) {
                return { valid: false, message: '学号不能为空' };
            }
        } else if (field === 'age') {
            const age = parseInt(value);
            if (isNaN(age) || age < 15 || age > 25) {
                return { valid: false, message: '年龄必须是15-25之间的数字' };
            }
        } else if (field === 'math' || field === 'english' || field === 'science') {
            const score = parseInt(value);
            if (isNaN(score) || score < 0 || score > 100) {
                return { valid: false, message: '成绩必须是0-100之间的数字' };
            }
        }

        return { valid: true };
    }

    // 初始化表格
    renderTable();
});