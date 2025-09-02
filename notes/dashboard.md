# dashboard page

* this is the page where lot of functionality is present-

* this is the dashboard page will look like

    ![dashboard page](../src/assets/dashboard%20page.png)

* the component in dashboard page will be something like this

    ![dasboard page component](../src/assets/dashboard%20component.png)

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

* ## (2) DashboardHeader.jsx

  * keep in mind this component contains **Contains search box, view mode toggle (grid/list), and new+ button**
  * now since this component handel three different purpose so lets go one by one.

  * ### (a) **Search**

    * so it recives **searchQuery** state and a function **setSearchQuery** to update the value of search query when it changes.
    * so in DashboardHeader component we had input and we are setting a *onChange* event on it which is handelSearchChange so this will get the latest text that is written in the search box and then set this text in the state **searchQuery**
    * *confusion* ***in dashboard page we need to call our search api -- ?? ideally it should be called when user types -- or either immediatly - if user stop writing - (like so we don't spam our server) **debounce** or when user hit enter or press the search icon ?? i am confused where should i put this logic***

    * todo => so when the dashboard header update the state searchquery then in dashboard page we need to call the our search api -- it will fetch items regard less of folder -- and it will fetch only loged in user data not other so we need to make a api call in dashboard page -- this is pending.

    * so we did the debounced search --- with a delay of 500ms which is enough i guess and also we implement this one when user press the enter then user should get the search result. so for this we are just doing onkeydown event.

  * ### (b) grid/list view

    * now search is done so we have gird/list view button
    * so for this we had a state **viewMode** and **setViewMode** function to set the view mode- the logic is simple if the *viewMode is grid then show the list and vice versa* then we will pass this view mode to **ItemGrid** component to change the ui of main content area of dashboard page
