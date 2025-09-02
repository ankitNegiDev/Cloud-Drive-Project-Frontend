# dashboard page

* this is the page where lot of functionality is present-

* this is the dashboard page will look like

    ![dashboard page](../src/assets/dashboard%20page.png)

* so here we have lot of component but we will start one by one

* ## (1) Sidebar.jsx

  * **Purpose** so this component main purpose is to show a sidebar that have Home, MyDrive , Shared with Me , Recent , Starred , Trash
  * now in dashboard page we must need to maintain a state that will keep track that which tab is currently selected by user by default it will by *Mydrive*
  * once we knows which tab is selected we can call api where need like when user select trash we need to call api so that we get items (file/folder) that are moved to trash.
  * so now the sidebar component take the state **activeSection** and **onSectionChange** function from the dashboard page and in Sidebar component we are just identifying which tab was clicked by using a onclick handeler on each tab so when user click that onclick handeler collect the id(that is name of tab) and passes back to dashboard page and by this dashboard page knows which tabe is clicked by user. and on dashboard page we can choose based on this id(name of tab) what we will show like for starred , trash etc
  * so this is how sidebar is working under the hood.

  * todo => so todo is based on activeSection we need to call api either for trash /starred/recent etc this is pending - and it will be done in dashboard page. so this is done.
  * todo -> *the pending is starred and recent routes* we will see at the end how we can do them.

  ---
