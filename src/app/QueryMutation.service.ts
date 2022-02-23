import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

@Injectable({
    providedIn: 'root'
})
export class QueryMutationService {

    constructor(
        private apollo: Apollo
    ) {
    }

    async Query( query: any, variables?: any, no_cache: boolean = true): Promise<any> {
        let query_name = query.definitions[0]['selectionSet'].selections[0].name.value;
        return new Promise<any>( (resolve, reject) => {
            let ob = this.apollo.query<any>({
                query: query,
                fetchPolicy: no_cache? 'no-cache' : undefined,
                errorPolicy: 'all',
                variables: variables
            }).subscribe( (res) => {
                if( res.errors)
                    reject(res);
                else
                    resolve(res.data[query_name]);
            })
        })
    }
    async Mutation( mutation: any, variables?: any): Promise<any> {
        let mutation_name = mutation.definitions[0]['selectionSet'].selections[0].name.value;
        return new Promise<any>( (resolve, reject) => {
            let ob = this.apollo.mutate<any>({
                mutation: mutation,
                fetchPolicy: 'no-cache',
                errorPolicy: 'all',
                variables: variables
            }).subscribe( (res) => {
                if( res.errors)
                    reject(res);
                else
                    resolve(res.data[mutation_name]);
            })
        })
    }
}
