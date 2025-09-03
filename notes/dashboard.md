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

  * ### (c) New button or +

    * this button has main work is to open a modal and show two feature one is to upload file and another is create folder.
    * so when the user is click on this button then we attach a onclick event on it and passed it back to dashboard page -- where we are changing the state **isModalOpen** so when user click on it the modal will open and when user click on cancel button the modal will be closed.
    * now how this modal will be looked like it is decided by another component that is **NewItemModal** this component is responsible for how the modal will look like and behave.

* ## (3) NewItemModal.jsx

  * this component is mostly responsible for when user click the new button it will open a modal that will show two thing *(a) user can create new folder and second (b) is user can upload a file*

    ```jsx
    <NewItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        parentId={currentFolderId}
        onItemCreated={handleNewItemCreated}
    />
    ```

  * here ---
  * isOpen -> determines visibility
  * onClose -> called to close the modal
  * parentId -> tells modal where the new folder/file should be created
  * onItemCreated -> callback to refresh the item list after creation

  * now in newItem modal we do only two things mainly one is folder creation so for that we call our folder creation api and second is file upload so for that we call our file upload api.

* ## (4) BreadCrumb.jsx

  * this component will mainly focus on handeling the navigation. means it will show the path of the current folder.. like **/root/newfolder/my-images/all images etc**
  * so breadcrumb has mainly work is when user click on any folder then set that file/folder detials in the breadcrumbs array (state) and later onNavigate we had a handeler function that will show the navigation for current folder.

* ## (5) UploadFile.jsx

  * this upload file component -- responsible for two thing -- one is upload file directly wit hthe button second is upload file using drag and drop.

  * *now the confusion is thsi drag and drop and upload file is coming when user will click the starrred/recent/trash tabs so we need to stop this so that it won't be visible there* for this we use activesection state in the dasboard page becsuse we will know when user will click theese tabs..

* ## (6) ItemGrid.jsx

  * this component is mainly responsible for showing the file/folder(items).second thing it will also handel when user will do single click then it will show a action bar dynamically just like google -- (add those functionality later) and when user do double click then open file/folder and when user do right click then open a menue just like google -- (some functionality are not working properly -- fix those)
  * **ahh one small thing-- when i do right click on any file/folder this action bar still open -- but i want this action bar open only on left click not on right click but we will do it later (once we are done with mvp)**
  * okey there is a error in re-name when user do re-name -- the backend recives new name as undefine so we need to check.
  * trash and download are working but rest are not so we will do it also.

  * now i am just stuck here -- i need to show the preview kind of image for the files and the folder should come above the files -- just like google -- so for this image one i need to call the backend api for getting the signed url... **keep in mind this api of generating signed url is breaking after deployment check it while it works correctly in local**
  * now to show the preview we just need to add one route in file router or item router whereever we want that will generate the signed url and we can show the preview of it and also use that as thumbnail..
  * now *keep in mind for supabse everything like image,video,pdf all are just file inside the bucket so we don't need seprate route we can use same route*
  * **now currently what we thought earlier is we will create a seprate route for signed url -- but then i just attach the signed url in the item router where we are fetching all file/folder inside a folder and now we have singed url for all types of files---**
  * *but the problem is for images its staright forward to show the image* but for *pdf, video* we can't just load the whole video or pdf -- it will put too much load so for test i will do this but later we will create a backend service that will handel some thing like thumbnail generator for video and pdf.

  * now so far we are done with showing the images pdf/video -- and now we need to focus on first functionality of when user do single click and action bar opens up - but before that we need to fix this functionality that when user double click it should open the file /folder now we have the signed url so its super easy to preview them on double click.
  * okey *now for pdf the preview is browser defualt one and i want a custom one so for this* we can use **react-pdf** `npm install react-pdf`
  * now preview is done - we are left with -- action bar functionality,and right click menue functionality.

* ## (7) Modals -- one by one --- PreviewModal

  * its main work is to show the preview when user do double click on any files.

* ## (8) ShareModal.jsx

  * this is responsible for core logic of sharing -- like public and restricted one.

  * so first we need to create a share modal
  * now what we need is we need a get route in shareRouter for fetching the info of an item like is this item is shared or not -- is it public share or restricted one etc...

  * ### (a) Public sharing

    * there are three steps for public share

    * #### Step 1 - get the share info of any item

      * so when the share modal open first we will get the share info of that item lik is it shared with any other person or not and so on.

    * #### Step 2 -> generate the token

      * now in second step we will call  this api ---> ***/api/shares/public/:itemId*** and this api will return the token which is then used in this api ***/api/shares/public/:token***

    * #### Step 3 -> generate the signed url for public access with expiry

      * now when we call thsi api -->  ***/api/shares/public/:token*** it will return the signed url that is created by supabse and have 1 hr expiry we can change it but its good 1hr-- and then we return this signed url as our public link.

    * so far our flow for public share link is --- first user will call the api `// (1) creating the public share link shareRouter.post('/public/:itemId', authMiddleware, createPublicShareController);` or ***/api/shares/public/:itemId*** this api will return the token which is then used in this api `// (3) accessing the public share link shareRouter.get('/public/:token', accessPublicShareController); // here no auth is required.  but we need to generate a signed url since our storage bucket is private so --` or ***/api/shares/public/:token*** and this api will return the signed url that will be generated by supabase -- and this signed url will become our public link
  * but for **restricted sharing*** the flow will be different and we need to work on that

  * #### (b) Restricted sharing

    * now for restricted sharing the flow is like -- first the user 1 will write the email address of user 2 and click on the add button --offcos the file is selected -- so by doing this we will call this api `// (1) Create a restricted share (with email or existing user)
    shareRouter.post('/restricted/:itemId', authMiddleware, createRestrictedShareController);` this api will simply do two thing -- first it will check if the user with the provided mail (that user type for share) is exist in our suapbase db or not -- if the user exist then store their id as shareWithId else if no user exist then store shared email then it will insert the all the info into the sahre table like which file is being shared ,who is sharing etc--
    * But **imp thing to note is -- we need something that check `When a user signs up or logs in is there are any items shared to their email before they had an account on our web-site and  we need to link those shares (file/folder) to that user Supabase user ID.` and for that we will use a `linkSharesForLoggedInUser` a service - which is written in auth service layer and it we will run this service once the user is loged in succcessfuly --** currently we include this in singup and loged in controller becasue -- we need to keep in mind that what if the user is loged in via -- google account so in that case we need to handel it slightly differntly becasue google login will never use our custom api to signup and login.. but lets assume right now we skip the google login--
    * now when the user with that email -- which is written by user 1 while sharing a file-- that user try to login our web-site -- since we have this service `LinkSharesForLoggedInUser` that runs after successful login so this will link all share to the supabse user id of this user which is currently doing login
    * now once this user loged in then it will reached to dashboard page -- and when this user click on shared-with-me from the sidebar - then we will call our api share-with-me -- `// (4) List of all files/folders shared with me shareRouter.get('/shared-with-me', authMiddleware, sharedWithMeController);` and it will return all the files/folder(items) that are being shared to this current user- and once we got all the files that are sahred -- now we need to call another api ---`shareRouter.get('/restricted/:shareId', authMiddleware, accessRestrictedShareController);` here shareId will be return by the this api `shareRouter.post('/restricted/:itemId'` so we can call our api -- `shareRouter.get('/restricted/:shareId', authMiddleware, accessRestrictedShareController);` and this api will -- return the signed url which is then used to show preview and thumbnail
    * *But keep in mind sometimes supabase gives error in generating the signed url which is not our issue its suapbase issue so we can't do anything with this*
    * **Now the most imp thing is why we are generating all these signed url is because we created our storage bucket as private and due o this we can't access the items directly form it that's why we request the supabase to generate the signed url that are time limited mostly the signed url will expird after 1hr**
