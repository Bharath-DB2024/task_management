export const MENU_ITEMS = {
  admin: [
    {
      key: 'menu',
      label: 'MENU',
      isTitle: true
    },
    {
      key: 'dashboards',
      label: 'Dashboards',
      icon: 'ri:dashboard-2-line',
      url: '/dashboards/analytics', 
    },
    {
      key: 'dashboard-group',
      label: 'Analytics',
      icon: 'ri-file-chart-line',
      url: '/dashboards/group'
    },
    {
      key: 'add-agent',
      icon: 'ri-user-add-line',
      label: 'Add Instructor',
      url: '/instructors/add'
    },
    {
      key: 'instructors',
      label: 'Instructors',
      icon: 'ri:group-line',
      children: [
        {
          key: 'instructors-list-view',
          label: 'List View',
          url: '/instructors/list-view',
          parentKey: 'instructors'
        }
      ]
    },
    {
      key: 'students',
      label: 'Students',
      icon: 'ri:group-line',
      children: [
        {
          key: 'list-view',
          label: 'List View',
          url: '/students/list-view',
          parentKey: 'students'
        }
      ]
    }
  ],

  instructors: [
    {
      key: 'menu',
      label: 'MENU',
      isTitle: true
    },
    {
      key: 'dashboards',
      label: 'Dashboards',
      icon: 'ri:dashboard-2-line',
      url: '/dashboard/analytics'
    },
    {
      key: 'Add-student',
      icon: 'ri-user-add-line',
      label: 'Add Student',
      url: '/student/add'
    },
    {
      key: 'students',
      label: 'Students',
      icon: 'ri:group-line',
      children: [
        {
          key: 'list-view',
          label: 'List View',
          url: '/student/list-view',
          parentKey: 'students'
        }
      ]
    },
    {
      key: 'task',
      label: 'Task',
      icon: 'ri-file-list-3-line',
      children: [
        {
          key: 'Add-Task',
          label: 'Add Task',
          icon: 'ri-file-add-line',
          url: '/task/add',
          parentKey: 'task'
        },
        {
          key: 'list view',
          label: 'List View',
          icon: 'ri-file-list-2-line',
          url: '/task/task-list',
          parentKey: 'task'
        }
      ]
    },
    // {
    //   key: 'custom',
    //   icon: 'ri-camera-switch-line',
    //   label: 'Custom',
    //   url: '/task/custom'
    // }
  ],

 students: [
    {
      key: 'menu',
      label: 'MENU',
      isTitle: true
    },
    {
      key: 'Dashboard',
      label: 'Dashboard',
      icon: 'ri:dashboard-2-line',
      url: '/Dashboard/analytics'
    },
    {
      key: 'list view',
      label: 'Task list',
      icon: 'ri-file-list-3-line',
      url: '/tasks/task-list',
      parentKey: 'task'
    }
  ]
};
