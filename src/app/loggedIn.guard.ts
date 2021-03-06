import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {    // Prevent user to visit Auth module if the user has userAccountToken available.

    constructor(
        private router: Router,
    ) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot) {
            if (localStorage.getItem('mainToken') && localStorage.getItem('userToken')) {
                this.router.navigate(['tasks'],{queryParams:{filter:'all'}});
                return false; // false means don't allow to further navigate to respective route
            }
            else if (!localStorage.getItem('userToken')) {
                this.router.navigate(['login']);
                return false; // false means don't allow to further navigate to respective route
            }
            return true; // allow to navigate
        }


}