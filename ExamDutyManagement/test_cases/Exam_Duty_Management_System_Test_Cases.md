# Exam Duty Management System (TrackClock) — QA Test Cases

> **Source Reference**: [Google Spreadsheet](https://docs.google.com/spreadsheets/d/1PlWLJO_RDzD9zIc2BxA63cfWnClESZ-E9k-_sFTB890/edit?usp=sharing)  
> **Available Files in Project**:
> - [Exam_Duty_Management_System_Test_Cases.csv](file:///c:/Users/CHANDANA/Desktop/Exam%20Duty%20Management%20System/ExamDutyManagement/test_cases/Exam_Duty_Management_System_Test_Cases.csv) (Direct Excel / Google Sheets Import)
> - [Exam_Duty_Management_System_Test_Cases.xls](file:///c:/Users/CHANDANA/Desktop/Exam%20Duty%20Management%20System/ExamDutyManagement/test_cases/Exam_Duty_Management_System_Test_Cases.xls) (Formatted Excel Spreadsheet with colors & borders)

---

| SL NO. | Test Cases | Test Scenarious | Expected Result | Actual Result | Pass/Fail | Additional Notes |
| :---: | :--- | :--- | :--- | :--- | :---: | :--- |
| **0** | **Login Page** | Enter a vaild credentials | if super admin credentails then redirect to superadmin dashboard | Entered valid Super Admin credentials and was redirected to the Super Admin dashboard. | **PASS** | |
| **1** | | | if Manger cerdentials then redirect to manager dashboard | Entered valid Manager credentials and was redirected to the Manager dashboard. | **PASS** | |
| **2** | | | If employee credentails then redirect to employee dashboard | Entered valid Employee credentials and was redirected to the Employee dashboard. | **PASS** | Login access is restricted to approved employee IDs. Unapproved employee IDs cannot access the Employee Dashboard. |
| **3** | | Enter In Valid credentials | Invalid credentials should not redirect to dashboard | Entered invalid credentials and the user was not redirected to any dashboard. | **PASS** | |
| **4** | | | show pop message saying invaild credentials | Entered invalid credentials and an "Invalid credentials" pop-up message was displayed. | **PASS** | |
| | **Superadmin** | | | | | |
| **6** | **Employee Details** | employee view | All employee view should display | All employee details are displayed correctly. | **PASS** | |
| **7** | | | Filter - Place: filter according to place selected | Employee list is filtered according to the selected place. | **PASS** | For some places shows 'No records found' |
| **8** | | | Filter - employee id / name: filter according to employee id / name selected | Employee list is filtered according to the selected Employee ID/Name. | **PASS** | emp_id shows when filtered with particular places and with all places |
| **9** | | | Filter - status: filter according to status selected | Employee list is filtered according to the selected status. | **PASS** | |
| **10** | | | single approve / reject : single approve or reject status should change according to user selection | Employee status is changed according to the selected Approve/Reject action. | **PASS** | |
| **11** | | | Pop-up message for action performed for single approve /reject: | A confirmation / A rejection pop-up message is displayed after the action. | **PASS** | pop-up message appears but once rejected or approved not able to redo |
| **12** | | | Action buttons reddirect to particular page | Action buttons redirect to the respective page correctly. | **PASS** | |
| **13** | | | multiple selection and action perform: approve and reject- selected employee should get approve or reject | All selected employees are approved/rejected successfully. | **PASS** | before approve or rejection pop-up message appears for confirmation. |
| **14** | | | multiple selection and action perform: approve and reject- Check on already approved status it should not approve or reject . pop message should come | Already approved employees cannot be approved/rejected and an appropriate pop-up message is displayed. | **PASS** | |
| **15** | | | multiple selection and action perform: delete - selected employee should delete. | All selected employees are deleted successfully. | **PASS** | |
| **17** | | | Before deleting an employee,it should ask for remark | No remark field is displayed before deleting the selected employee. Only a confirmation popup with "Yes, delete!" and "Cancel" is displayed. | **FAIL** | Remark/reason for deletion is not requested before deletion. Only a confirmation popup is displayed. |
| **18** | | | disclaimer checkbox should be marked | no disclaimer checkbox is displayed. | **FAIL** | The employee can proceed to the delete confirmation without selecting a disclaimer checkbox. |
| **18** | | | while adding employee work place which we have selected,it should be display in table as it is | - | **PENDING** | |
| **19** | | | Add in the bulk-employee details: a pop-up message for bulk upload.<br>without file can not submit.<br>After successfull submit a pop-message regarding status | submission without file is prevented;but xlsx and csv file sample formate provided is not accepted. | **FAIL** | The provided sample-format XLSX file is not being accepted by the bulk employee upload feature even though XLSX is listed as an allowed format. |
| **20** | | | SMS once approved sms notification to employee with login credentials | sms notification is sent to employee with login credentials. | **PASS** | sms is sent after 2 to 3 days after registeration. |
| **21** | | | export the employee details accroding to place selected | Employee details are exported according to the selected place. | **PASS** | |
| **22** | | | export - if data is not present for selected employee message should populate | A message is displayed saying that no employee data is available for export. | **PASS** | |
| **23** | | Edit employee Details | Validate the perticular employee details is populating in screen | The selected employee's details are displayed correctly in the form. | **PASS** | |
| | | | Should able to edit all fields except date of joining | All employee details can be edited except Date of Joining. | **PASS** | |
| **25** | | | Validate all fields empty (except photo) should not sumbit the form | All employee details can be edited except Date of Joining. | **PASS** | |
| **26** | | | If aadhaar and phone number same as existing one show error alert | - | **PENDING** | |
| **27** | | | work place which we have selected,it should be display in table as it is | The selected workplace is displayed correctly in the employee table. | **PASS** | |
| **28** | | | After submiting pop-up message for status - redirect to employee details view on success | A success/status popup is displayed and the user is redirected to the Employee Details page. | **PASS** | |
| **29** | | employee profile view | All the data related to employee should display | All details related to the employee are displayed in the profile. | **PASS** | |
| **30** | | | validate the amount showing properly according to attendace status approved. No rejected attendace amount should add. | The amount is calculated using only approved attendance. Rejected attendance is not included. | **PASS** | Once attendance is rejected, it cannot be given again, and the rejected attendance is not included in the amount calculation. |
| **31** | | | display the latest 8 employee attendace details | The latest 8 attendance records are displayed correctly. | **PASS** | |
| **32** | **Manager Details** | manager view | All manager view should display | All manager details are displayed correctly in the Manager View. | **PASS** | |
| **33** | | | Filter - Place: filter according to place selected | Manager list is filtered according to the selected place. | **PASS** | |
| **34** | | | Filter - manager id / name: filter according to manager id / name selected | Manager list is filtered correctly according to the entered Manager ID/Name. | **PASS** | |
| | | | multiple selection and action perform: delete - selected manager should delete. | Selected managers were deleted successfully. | **PASS** | |
| **36** | | | Action button reddirect to particular page | The action button redirects to the respective manager details page. | **PASS** | |
| **37** | | Add manager | If aadhaar and phone number same as existing one show error alert | No error alert is displayed when an existing Aadhaar number or phone number is entered. | **PASS** | The system allows duplicate Aadhaar/phone numbers without displaying a validation or error message. |
| **38** | | | Validate all fields empty, should not sumbit the form | The form is not submitted when all fields are left empty. | **PASS** | |
| | | | Validation for manager aadhar number | No error alert is displayed when an existing Aadhaar number or phone number is entered. | **FAIL** | The system allows duplicate Aadhaar/phone numbers without displaying a validation or error message. |
| | | | all workplaces must be unique, if not should show pop up | The system allows the same workplace to be assigned to multiple managers without displaying any warning message. | **FAIL** | Duplicate workplace is allowed. |
| **41** | | | After submiting pop-up message for status - redirect to employee details view on success | A success/status popup is displayed after submission, and the user is redirected to the Manager Details page. | **PASS** | |
| **42** | | Edit manager Details | Validate the perticular manager details is populating in screen | The selected manager's details are populated correctly in the Edit Manager screen. | **PASS** | |
| **43** | | | Validate all fields empty (except photo) should not sumbit the form | The form is not submitted when all required fields are left empty. | **PASS** | |
| | | | profile picture should allow only png or jpg formats | The profile picture field allows unsupported file formats. | **PASS** | |
| **45** | | | If aadhaar and phone number same as existing one show error alert | - | **PENDING** | |
| **46** | | | After submiting pop-up message for status - redirect to manager details view on success | A success/status popup is displayed after submission, and the user is redirected to the Manager Details view. | **PASS** | |
| **47** | **Job Details** | Job details view | display all job details order by date wise, work place | All job details are displayed and arranged according to date and workplace. | **PASS** | |
| **48** | | | Filter - Center: filter according to center name selected | Job details are filtered according to the selected center. | **PASS** | |
| **49** | | | Filter - Place: filter according to place selected | Job details are filtered according to the selected place. | **PASS** | |
| **50** | | | Filter - job name: filter according to job name selected | Job details are filtered according to the selected job name. | **PASS** | |
| **51** | | | multiple select: Delete - delete the selected job.before deleteing a confirmation pop-up message. after deleteing a pop message for confirmation | Selected jobs are deleted successfully. A confirmation popup is displayed before deletion and a success message is displayed after deletion. | **PASS** | |
| **52** | | | Add in the bulk-job details: a pop-up message for bulk upload.<br>with out file can not submit.<br>After successfull submit a pop-message regarding status | The bulk job upload popup is displayed, but the provided sample format file is not accepted and the system does not allow the file to be uploaded. | **FAIL** | The system rejects the sample format file even though it is provided as the required format for bulk job upload. File upload cannot be completed. |
| **53** | | | validating clicking the add job details - redirect to add job details | Clicking Add Job Details redirects to the Add Job Details page. | **PASS** | |
| **54** | | | validate on edit option under action column , particular job details is coming in edit | The selected job details are populated correctly in the Edit Job Details page. | **PASS** | |
| **55** | | Add job details | Validate all fields empty (except annexure file) should not sumbit the form | The form is not submitted when all required fields are left empty. | **PASS** | |
| **56** | | | Validate if the empty file is added to bulk employee details it should give error message | an error occurred while submitting empty file | **PASS** | |
| **57** | | | validate the job date >= current date | The system does not allow a past date to be selected for the Job Date. | **PASS** | |
| **58** | | | After submiting pop-up message for status - redirect to job details view on success | A success/status popup is displayed after submission, and the user is redirected to the Job Details view. | **PASS** | |
| **59** | | | Annexure File Upload for particular Jobs | Annexure file was uploaded successfully for the selected job. | **PASS** | |
| **60** | | Edit Job Details | Validate the perticular job details is populating on screen | The selected job details are populated correctly on the Edit Job Details screen. | **PASS** | |
| **61** | | | Validate all fields empty should not sumbit the form | The form is not submitted when all required fields are empty. | **PASS** | |
| | | | validate the actual > paying amount | The Actual amount and Paying amount are displayed correctly according to the job details. | **PASS** | |
| **63** | | | validate the job date >= current date | The system does not allow a past date to be entered/selected for the Job Date. | **PASS** | |
| **64** | | | After submiting pop-up message for status - redirect to job details view on success | A success/status popup is displayed and the user is redirected to the Job Details view. | **PASS** | |
| **65** | **Assigned job employee** | Assign a job employee view | display all employeedetails order by date wise, work place | All employee details are displayed in date-wise order along with the workplace. | **PASS** | |
| **66** | | | Filter - Center: filter according to center name selected | Center name is not available as a filter option. Only the Duty Name option is displayed. | **FAIL** | The Center filter is missing from the assigned job employee View, so employees cannot be filtered according to Center. |
| **67** | | | Filter - Place: filter according to place selected | Employee list is filtered according to the selection place. | **PASS** | |
| **68** | | | Filter - emp name/id: filter according to employee name or emp id selected | Employee list is filtered according to the selected employee name or ID. | **PASS** | |
| **69** | | | Save - display all duty name available according to duty date selected | All available duty names are displayed according to the selected duty date. | **PASS** | |
| **70** | | | Save - if no duty available on selected date, should populate "No duty available on this date" | "no duty available on this date" message is displayed when no duty is available for the selected date. | **PASS** | |
| **71** | | | Save - if job already assigned,should show warning | A warning message is displayed when the selected job is already assigned to the employee. | **PASS** | When the selected job is already assigned to the employee, the system displays the duplicate count. |
| | | | After submitting save it should show a pop up. | A success/status popup is displayed after successfully saving the job assignment. | **PASS** | |
| **73** | | | Save - if work place doesn't match,should show warning | A warning is displayed when the employee's workplace does not match the selected job workplace | **PASS** | |
| **74** | **Employee Assigned details** | Employee assigned Jobs view | display all job details order by date wise, work place | Displaying job details ordered by date and work place | **PASS** | |
| **75** | | | Filter - Center: filter according to center name selected | Job details are filtered according to the selected center. | **PASS** | |
| **76** | | | Filter - Place: filter according to place selected | Job details are filtered according to the selected place. | **PASS** | |
| **77** | | | Filter - emp name/id: filter according to employee name or emp id selected | Job details are filtered according to the selected employee name or ID. | **PASS** | |
| **78** | | | single approve / reject : single approve or reject status should change according to user selection | Job details are filtered according to the selected employee name or ID. | **PASS** | |
| **79** | | | Pop-up message for action performed for single approve /reject: | A pop-up message is displayed for single action approve / reject option. | **PASS** | |
| **80** | | | multiple selection and action perform: approve and reject- selected employee should get approve or reject | The selected employee jobs are successfully approved/rejected after performing the bulk action. | **PASS** | |
| **81** | | | multiple selection and action perform: approve and reject- Check on already approved status it should not approve or reject . pop message should come | Already approved jobs cannot be approved/rejected again. | **PASS** | |
| **82** | | | multiple selection and action perform: delete - selected employee should delete. | The selected employee jobs are deleted successfully. | **PASS** | |
| | | | after employee mark the job,it should be display in table | The job marked by the employee is displayed correctly in the Employee Assigned Jobs table. | **PASS** | |
| **84** | | | export the employee job details accroding to date and place wise | The employee job details according to date and place can be exported. | **PASS** | |
| **85** | | | export - if data is not present for selected date message should populate | No records found! Please try selecting another date | **PASS** | |
| **86** | **Attendanace details** | employee attendace view | All employee attendace view should display | Employee Attendance View is displayed with employee attendance records and all relevant details. | **PASS** | |
| **87** | | | Filter - Center: filter according to center name selected | The attendance records were filtered according to the selected center. | **PASS** | After selecting Tcsidz Shivamoga center, only attendance records belonging to Tcsidz Shivamoga were displayed. Other selected centers with no records displayed "No records found". |
| **88** | | | Filter - Place: filter according to place selected | The attendance records were filtered according to the selected place | **PASS** | After selecting Shivamogga as the Work Place, only attendance records with Work Place as Shivamogga were displayed. For places with no attendance records, "No records found" was displayed. |
| **89** | | | Filter - employee id / name: filter according to employee id / name selected | Employee ID and name search filter returned the matching employee record. | **PASS** | Searching SHI04030563 and Afiya displayed Afiya Banu with the corresponding employee details |
| **90** | | | Filter - status: filter according to status selected | Records were filtered according to selected status. | **PASS** | |
| **91** | | | single approve / reject : single approve or reject status should change according to user selection | Approved/Rejected status can be changed for a single employee. | **PASS** | The selected employee’s status updates correctly after clicking Approve or Reject. |
| **92** | | | Pop-up message for action performed for single approve /reject: | Pop-up message is displayed after the approve/reject action. | **PASS** | |
| **93** | | | multiple selection and action perform: approve and reject- selected employee should get approve or reject | Selected employees are approved or rejected successfully. | **PASS** | |
| **94** | | | multiple selection and action perform: approve and reject- Check on already approved status it should not approve or reject . pop message should come | Already approved records cannot be approved or rejected again. | **PASS** | pop up "no eligible employees selected for this action". |
| **95** | | | multiple selection and action perform: delete - selected employee should delete. | Selected emolyee deleted successfully!. | **PASS** | |
| **96** | | | SMS: sms notification to employee about status of attendance details | sms notification is not sent to registered employee abt attendence details. | **FAIL** | can view recent attendence records,in load more it also shows attendence status. |
| **97** | | | export the employee attendace details according to date and place wise | Attendance details exported according to selected date and place. | **PASS** | |
| **98** | | | export - if data is not present for selected date message should populate | No Records Found! Please try selecting another date. | **PASS** | |
| | **Employee** | | | | | |
| **100** | | | Add Header as employee | Employee View header is displayed correctly. | **PASS** | |
| **101** | **profile view** | employee profile view | validate all the details are correct to that perticular employee | Employees details are displayed correctly for the selected employee' | **PASS** | |
| **102** | | | confirmation pop redirect to dashboard | Confirmation pop-up displayed and redirected to dashboard successfully. | **PASS** | |
| **103** | | employee profile edit | Employee can be edit only these details.<br>1.Email ID<br>2.Qualification<br>3.Address<br>4.Profile Pic | These details can be edited. | **PASS** | Only date of joining can't be edited. |
| **104** | | | Able to upload both front and back side of aadhar card | Aadhaar front and back documents can be uploaded or edited. | **PASS** | |
| **105** | | | After submitting save changes it should redirect to employee dashboard | After saving changes, the page is redirected to the Employee Dashboard successfully. | **PASS** | |
| **106** | **Dashboard** | dashboard | validate employee name, Employee ID, Work Place, Payment Remaining, Previous Month Pending are proper according to particular employee | Employee details and payment information are displayed correctly. | **PASS** | |
| **107** | | | bank details are populating properly | Bank details are populating correctly. | **PASS** | |
| **108** | | | if bank details are not present then warning pop message regarding bank deatils | A warning message pop-up if bank details are not present. | **PASS** | |
| **109** | | | current date job details displaying | Current date 28/08/2026 and corresponding job details are displayed correctly. | **PASS** | |
| **110** | | | latest recent attendace record display | Attendance records are displayed, with the latest available attendance date shown as 2026-08-11. | **PASS** | No attendance record is available for the current date. |
| | | | after submitiing mark job,a pop up message should come | it shows pop up message as "no job selected" | **PASS** | |
| **112** | | | validate on login and logout btn redirect to perticular page | Login and logout redirection works correctly. | **PASS** | |
| **113** | | | should able to update the profile pic if not updated in bulk upload | Profile picture was successfully uploaded and updated. | **PASS** | The updated photo is displayed on the employee profile. |
| **114** | **Update bank Details** | update bank Details | validation all the fields | All mandatory fields are validated correctly. | **PASS** | |
| **115** | | | after submitiing a pop message regarding status | Success popup is displayed after submitting the employee details. | **PASS** | |
| **116** | | | validate in dashboard a correct bank details is comming | correct bank details are displaying. | **PASS** | |
| **117** | **LogIn / Logout** | Login | validate current date and time is populating | - | **PENDING** | |
| **118** | | | validate based on work place and current date the job details are present in drop down. Shift number and paying amount is populating based on job deatils selected | validated based on workplace,date,shifts and paying amount is populating on job details. | **PASS** | |
| **119** | | | captures the live pic. validate no dark image is considering | Live photo/camera capture option is not available in the current application. Therefore, live picture capture and dark image validation could not be performed. | **FAIL** | The application does not provide a live photo/camera capture option, so the required live photo cannot be captured or submitted. |
| **120** | | | After save the entry should display in attendance details | No option to create or save a new attendance entry is available in the accessible Admin pages. Therefore, verification of the saved entry in Attendance Details could not be performed. | **FAIL** | Live photo capture is not available in the system; therefore, the system cannot capture or validate the employee's live image. |
| **121** | | | After submitting logint it should redirect to employee profile page | After submitting the login details, the user is successfully redirected to the Employee Profile page. | **PASS** | |
| **122** | | | Logout btn enables and login btn disable in dashboard after successfully saving the login details | After successfully saving the login details, the Logout button is enabled and the Login button is disabled on the dashboard. | **PASS** | |
| **117** | | Logout | Annexure should be uploaded before attendance logout(need a pop up as"please upload annexure". | When the required document is not uploaded, a pop-up message "Please upload your documents" is displayed and logout is prevented. | **PASS** | |
| **124** | | | Validate based on login details data populating. | Employee details are validated and the correct details are populated based on the logged-in user. | **PASS** | |
| **125** | | | captures the live pic. validate no dark image is considering | Live picture is not being captured by the system. | **FAIL** | Live photo capture functionality is not available/implemented, so the system cannot validate or reject dark/unclear images. |
| **126** | | | After save the entry should display in attendance details | the attendance entry is not displayed in the Attendance Details section. | **FAIL** | The newly created attendance entry is not displayed in the Attendance Details section, making it difficult to verify whether the attendance was recorded successfully. |
| | | | After submitting logout it should redirect to employee profile page | After submitting logout, the user is successfully redirected to the Employee Profile page. | **PASS** | |
| **128** | | | Logout and Login btn disable. A message showing current date attendace is already marked | the Login and Logout buttons are disabled, and the message indicating that attendance for the current date has already been marked is not displayed. | **FAIL** | The expected current-status message is not displayed correctly after performing the relevant action. |
| **123** | | | populating time should be correct | The attendance time is populated correctly according to the actual logout time. | **PASS** | |
| **130** | **Registartion Form** | Aadhar registration | with one aadhar number only one time registration | The system does not allow the same Aadhar number to be registered more than once. | **PASS** | |
| **131** | | Validating aadhar number | If 12 digit number,then allow 12 digit numbers only | Only 12-digit Aadhar numbers is accepted. | **PASS** | |
| **132** | | Validating Phone number | If 10 digit number,then allow 10 digit numbers only | Only 10-digit phone numbers is being accepted | **PASS** | |
| **133** | | Pan registration | with one Pan card number only one time registration | - | **PENDING** | |
| **134** | | Validation for Employee name | If alphabets then should take only alphabets | The system allows non-alphabetic characters such as numbers in the Employee Name field. | **FAIL** | The field accepts numeric and other non-alphabetic characters even though it is expected to accept alphabetic characters only. |
| **135** | | IMPLEMENTATION STAGE: SMS after successful registration | validate sms is going to employee after registration completed | SMS after successful registration is sent to employee. | **PASS** | Registration completes successfully, but the expected SMS notification is received by the employee within 2 or 3 days of registration. |
| | **Manager** | | | | | |
| **137** | **Dashboard** | Menu bar | Menu bar should be in this order: 1.Employee details, 2.Job details, 3.Assigned jobs, 4.Mark Attendance, 5.Attendance details, 6.Group selfie, 7.Upload documents, 8.Settings | menubar is not in order,not showing dashboard,mark attendence,group selfie,upload docs and settings | **FAIL** | The menu is not arranged as expected and important options such as Dashboard, Mark Attendance, Group Selfie, Upload Documents, and Settings are not displayed correctly. |
| **138** | **Employee Details** | employee view | All employee view should display Based on manager work_place | Employee details are displayed according to the manager's workplace. | **PASS** | |
| **139** | | | Filter - Place: filter according to place selected | Employee list is filtered according to the selected place. | **PASS** | |
| **140** | | | Filter - employee id / name: filter according to employee id / name selected | Employee list is filtered correctly based on the selected employee ID/name | **PASS** | |
| **141** | | | All employee view should display | All employee details are not displayed correctly. | **PASS** | |
| **142** | | | export the employee details accroding to place selected | Employee details are exported according to the selected place. | **PASS** | |
| **143** | | | export - if data is not present for selected employee message should populate | A message is be displayed if no data is available. | **PASS** | |
| **144** | | Add employee | If aadhaar and phone number same as existing one show error alert | If Aadhaar and phone number are same as existing one show pop-up message. | **PASS** | |
| **145** | | | Validate all fields empty (except photo) should not sumbit the form | The form is not submitted when the required fields are left empty. | **PASS** | |
| **146** | | | After submiting pop-up message for status - redirect to employee details view on success | pop-up message is displayed and the user is redirected to the Employee Details view successfully. | **PASS** | |
| **147** | | Edit employee Details | Validate the perticular employee details is populating in screen | The selected employee's details are populated correctly on the Edit Employee screen. | **PASS** | |
| **148** | | | Validate all fields empty should not sumbit the form | The form is not submitted when the required fields are left empty | **PASS** | |
| **149** | | | If aadhaar and phone number same as existing one show error alert | - | **PENDING** | |
| **150** | | | After submiting pop-up message for status - redirect to employee details view on success | pop-up message is displayed and the user is redirected to the Employee Details view after successful submission. | **PASS** | |
| **151** | **Job Details** | Job details view | display all job details order by date wise, work place Based on manager work_place | Job details are displayed correctly based on date and manager workplace. | **PASS** | |
| **152** | | | Filter - Center: filter according to center name selected | Job details are filtered according to the selected center name. | **PASS** | |
| **153** | | | Filter - job name: filter according to job name selected | Job details are filtered according to the selected job name. | **PASS** | |
| **154** | **Assigned Jobs** | Employee assigned Jobs view | display all job details order by date wise, work place Based on manager work_place | Assigned job details are displayed correctly based on date and manager workplace. | **PASS** | |
| **155** | | | Filter - Center: filter according to center name selected | Job details are filtered according to the selected center name. | **PASS** | |
| **156** | | | Filter - emp name/id: filter according to employee name or emp id selected | Job details are filtered correctly based on the selected employee name or employee ID. | **PASS** | |
| **157** | | | export the employee job details accroding to date wise | Employee job details are exported correctly according to the selected date. | **PASS** | |
| **158** | | | export - if data is not present for selected date message should populate | Appropriate message is displayed when employee job data is not available for the selected date. | **PASS** | |
| **159** | **Mark attendance** | Employee assigned job | Filter - Center: filter according to center name selected | filters according to center name selected. | **PASS** | |
| **160** | | | Filter - employee id / name: filter according to employee id / name selected | it filters according to empid and name selected. | **PASS** | |
| **161** | | | manager can mark the employee attendance | Manager is not able to mark the employee's attendance. | **FAIL** | The manager cannot mark attendance for the assigned employee because the attendance-marking functionality is not available/working. |
| **162** | **Attendanace details** | employee attendace view | All employee attendace view should display Based on manager work_place | Employee attendance details are successfully displayed based on the manager's workplace. | **PASS** | |
| **163** | | | Filter - Center: filter according to center name selected | Employee attendance details are successfully filtered according to the selected center name | **PASS** | |
| **164** | | | Filter - employee id / name: filter according to employee id / name selected | Employee attendance details are successfully filtered according to the selected employee ID or name. | **PASS** | |
| **165** | | | export the employee attendace details accroding to date & place wise | Employee attendance details are successfully exported according to the selected date and place. | **PASS** | |
| **166** | | | export - if data is not present for selected date message should populate | When no attendance data is available for the selected date, an appropriate message is successfully displayed. | **PASS** | |
| **167** | **Upload documents** | Annexure file upload | Filter - Center: filter according to center name selected | Documents are successfully filtered according to the selected center name. | **PASS** | |
| **168** | | | Filter - duty name / project name: filter according to duty name / project selected | Documents are successfully filtered according to the selected duty name/project name | **PASS** | |
| **169** | | | once document uploaded,it should be disabled | After the document is uploaded successfully, the upload option is disabled. | **PASS** | |
| **170** | **Group selfie** | Upload group photo | Filter - Center: filter according to center name selected | Center name is not available as a filter option. Only the Duty Name option is displayed. | **FAIL** | The Center filter is missing from the assigned job employee View, so employees cannot be filtered according to Center. |
| **171** | | | Filter - duty name / project name: filter according to duty name / project selected | cannot be filtered according to duty name. | **FAIL** | The system shows that no duty is available for the selected date. |
| **172** | | | once photo uploaded,it should be disabled | Group Photo upload functionality is not available, so this validation cannot be performed. | **FAIL** | The Group Photo upload functionality is unavailable, so the system cannot be verified for disabling the option after a photo is uploaded. |
| **170** | | | After submitting, it should redirect to upload group photo view | Upload Group Photo view is not available, so redirection cannot be performed. | **FAIL** | The Upload Group Photo view is unavailable, so the redirection after submitting a group photo cannot be tested. |
| **171** | | | Verify unsupported document format | unsupported documents are not supported. | **PASS** | |
| **172** | | | Verify document exceeding maximum file size | System rejected the document because it exceeded the maximum allowed file size. | **PASS** | |
| **173** | | | Verify uploaded document can be viewed/downloaded | Uploaded document was successfully viewed and downloaded. | **PASS** | |
| **174** | | | Verify document upload after page refresh | Uploaded document remained available after refreshing the page. | **PASS** | |
| **175** | | | Verify manager cannot view employees outside assigned workplace | Manager was unable to view employees from workplaces outside the assigned workplace. | **PASS** | |
| **176** | | | Verify manager cannot edit unauthorized employee details | Manager was unable to edit details of unauthorized employees. | **PASS** | |
| **177** | | | Verify manager cannot access admin-only functions | Manager was restricted from accessing admin-only functions. | **PASS** | |
| **178** | | | Verify manager session expires after logout | Manager session was successfully terminated after logout. | **PASS** | |
| **179** | | | Verify direct URL access to unauthorized page | Direct access to the unauthorized page was denied and the user was redirected/restricted. | **PASS** | |
| **180** | | | Verify password visibility toggle | Password visibility toggle successfully showed and hid the password. | **PASS** | |
| **181** | | | Verify login button during multiple clicks | Multiple clicks on the login button did not create duplicate login requests/actions. | **PASS** | |
| **182** | | | Verify session after browser refresh | User session remained active after browser refresh. | **PASS** | |
| **183** | | | Verify session timeout | User session does not expire after the configured timeout period. | **FAIL** | there is no timeout for user session |
| **184** | | | Verify employee ID generation | Employee ID was generated successfully and uniquely for the employee. | **PASS** | |
| **185** | | | Verify employee ID cannot be modified | employee ID cannot be modified. | **PASS** | |
| **186** | | | Verify employee list pagination | Employee list was successfully displayed across multiple pages, and pagination worked correctly. | **PASS** | |
| **187** | | | Verify unique Manager ID generation | A unique Manager ID was generated successfully for each manager. | **PASS** | |
| **188** | | | Verify manager deletion cancellation | Manager deletion was not cancelled and manager record was succesfully deleted. | **FAIL** | The manager deletion cancellation option is not working as expected, as the manager record was deleted successfully instead of cancelling the deletion. |
| **189** | | | Verify manager list pagination | Manager list was successfully displayed across multiple pages, and pagination worked correctly. | **PASS** | |
| **190** | | | Verify job ID uniqueness | A unique Job ID was generated successfully for each job. | **PASS** | |
| **191** | | | check trackclock application is responsive | Tracklock application is responsive and displays correctly across different screen sizes and devices without layout issues. | **PASS** | |
