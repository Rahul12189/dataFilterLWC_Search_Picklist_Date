import { LightningElement, wire, track } from 'lwc';
import retrieveOpportunities from '@salesforce/apex/DataController.retrieveOpportunities';
import updatedOpportunityDetails from '@salesforce/apex/DataController.updatedOpportunityDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import dateFilter from '@salesforce/apex/DataController.dateFilter';


const columns = [ { label: 'Opportunity Name', fieldName: 'Name', sortable: "true", editable: "true" },
                  { label: 'Account Id', fieldName: 'AccountId', sortable: "true", editable: "true"},
                  { label: 'Close Date', fieldName: 'CloseDate', type: "date",sortable: "true", editable:"true"},
                  { label: 'Probability', fieldName: 'Probability', type: 'number', sortable: "true", editable: true},
                  { label: 'Stage Name', fieldName: 'StageName', type: 'picklist', sortable: "true", editable: true,}]
 
export default class LWCFilterSearchDatatable extends LightningElement {
    @track data;
    @track error;
    @track columns = columns;
    @track searchString;
    @track initialRecords;
    @track sortBy='Name';
    @track sortDirection='asc';
    @track startDate="";
    @track endDate="";
    @track opportunity;
    @track startDate1;
    @track endDate1;


    @wire(retrieveOpportunities,{field : '$sortBy',sortOrder : '$sortDirection'})
    wiredOpportunity({ error, data }) {
        if (data) {
            console.log(data);
            this.data = data;
            this.initialRecords = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }

    // calling sortdata function to sort the data based on direction and selected field
    doSorting(event) {
        
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
    }

    //Taking Date Input
    handleChangeAction(event){
             
 
        if(event.target.name == 'startDate'){
            this.startDate = event.target.value;  
           
            window.console.log('startDate : ' + this.startDate);
        }
 
        if(event.target.name == 'endDate'){
            this.endDate = event.target.value;  
            window.console.log('endDate : ' + this.endDate);
        }
 
    }

    //On Apply Date Filter
    handleApply(){
        
        if(this.startDate > this.endDate){
            this.dispatchEvent(
                new ShowToastEvent({
                    title: Error,
                    message: 'Start Date Cannot be Greater Than End Date',
                    variant: 'Error'
                })
            );
            return;
            
        }
        
        if(this.startDate != null && this.endDate != null){
		dateFilter({startDate1: this.startDate,endDate1: this.endDate })
		.then(result => {
			this.data = result;
			this.error = undefined;
		})
        
		.catch(error => {
			this.error = error;
			this.data = undefined;
		})
        
    }
        
     }
 
     //When Clear Date Filter
    handleClear(){
        
        this.startDate="";
        this.endDate="";
        window.alert("Clear Clicked");
        if (true) {
            this.data = this.initialRecords;
 
            if (this.data) {
                let searchRecords = [];
 
                for (let record of this.data) {
                    let valuesArray = Object.values(record);
 
                    for (let val of valuesArray) {
                        console.log('val is ' + val);
                        let strVal = String(val);
 
                        if (strVal) {
 
                            if (strVal.toLowerCase().includes(searchKey)) {
                                searchRecords.push(record);
                                break;
                            }
                        }
                    }
                }
 
                console.log('Matched Accounts are ' + JSON.stringify(searchRecords));
                this.data = searchRecords;
            }
        } else {
            this.data = this.initialRecords;
        }
    }

    
    //Stage Picklist Values
    get options() {
        return [
            { label: 'none', value: 'none' },
            { label: 'Qualified', value: 'Qualified' },
            { label: 'On-Site Evaluation', value: 'On-Site Evaluation' },
            { label: 'Quote Generation', value: 'Quote Generation' },
            { label: 'Quote Approved', value: 'Quote Approved' },
            { label: 'Negotiation', value: 'Negotiation' },
            { label: 'Signing', value: 'Signing' },
            { label: 'Closed Won', value: 'Closed Won' },
            { label: 'Closed Lost', value: 'Closed Lost' },
            
            
        ];
    }

    //Stage selection result
    handleStageChange(event) {
        var stageValue = event.detail.value;
        console.log("Selected Stage is : "+stageValue);
 
        if (stageValue!='none') {
            this.data = this.initialRecords;
 
            if (this.data) {
                let searchRecords = [];
 
                for (let record of this.data) {
                    let valuesArray = Object.values(record);
 
                    for (let val of valuesArray) {
                        console.log('val is ' + val);
                        let strVal = String(val);
 
                        if (strVal) {
 
                            if (strVal.includes(stageValue)) {
                                searchRecords.push(record);
                                console.log("Stage Value :  "+ stageValue);
                                break;
                            }
                        }
                    }
                }
 
                console.log('Matched Accounts are ' + JSON.stringify(searchRecords));
                this.data = searchRecords;
            }
        } else {
            this.data = this.initialRecords;
        }
    }

    //When Starting Search 
    handleSearch(event) {
        const searchKey = event.target.value.toLowerCase();
 
        if (searchKey) {
            this.data = this.initialRecords;
 
            if (this.data) {
                let searchRecords = [];
 
                for (let record of this.data) {
                    let valuesArray = Object.values(record);
 
                    for (let val of valuesArray) {
                        console.log('val is ' + val);
                        let strVal = String(val);
 
                        if (strVal) {
 
                            if (strVal.toLowerCase().includes(searchKey)) {
                                searchRecords.push(record);
                                break;
                            }
                        }
                    }
                }
 
                console.log('Matched Accounts are ' + JSON.stringify(searchRecords));
                this.data = searchRecords;
            }
        } else {
            this.data = this.initialRecords;
        }
    }

    //Record Saving

    handleSave(event){

        const updatedField = event.detail.draftValues;
        console.log('UpdatedField: '+JSON.stringify(updatedField));

        updatedOpportunityDetails({opportunityData : updatedField})
        .then( result =>{
            console.log('apex result : '+JSON.stringify(result))
            
            this.dispatchEvent(
                new ShowToastEvent({
                    title: result,
                    message: result,
                    variant: 'Success'
                })
            );
        })
        .catch(error=>{
            console.error('Error :'+JSON.stringify(error));
        })
    }
}
