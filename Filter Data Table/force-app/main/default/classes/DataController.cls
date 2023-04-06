public with sharing class DataController {
     
    ////Sorting Function Starts Here///////////
    @AuraEnabled (cacheable=true)
    public static List<Opportunity> retrieveOpportunities(String field, String sortOrder){
        String query;
        query  = 'SELECT Id, Name, AccountId, StageName, CloseDate, Probability FROM Opportunity';
        if(field != null && sortOrder !=null){
            query += ' ORDER BY '+field+' '+sortOrder;
        }
        return Database.query(query);
    }

    //////Date Filter Starts Here//////////////////
    @AuraEnabled(cacheable = true)
    public static List<Opportunity> dateFilter(Date startDate1,Date endDate1){
        Date start = startDate1;
        Date endd = endDate1;

        List<Opportunity> oppList  = [SELECT Id, Name, AccountId, StageName, CloseDate, Probability FROM Opportunity WHERE CloseDate >=: start and CloseDate <=: endd];
        System.debug('Date Filete Applied Date : ' + oppList);
        return oppList;
    }

    ///////Edit Save Starts Here/////////////////////////////    
    @AuraEnabled
    public static String updatedOpportunityDetails(Object opportunityData){
        System.debug('Opportunity Data :'+opportunityData);

        List<Opportunity> oppList = (List<Opportunity>) JSON.deserialize(JSON.serialize(opportunityData), List<Opportunity>.class);
        System.debug('Opportunity List :'+oppList);
        if(!oppList.isEmpty()){
            update oppList;
            return 'Success';
        }
        return 'Failed';

    }
}