<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

/**
 * Write static login information to the session.
 * Use for test purposes.
 */
class AuthController extends Controller
{
    public function login(Request $request) {
        $request->session()->put('abalo_user', 'visitor');
        $request->session()->put('abalo_user_id', 5); // arbitrary user id for testing
        $request->session()->put('abalo_mail', 'visitor@abalo.example.com');
        $request->session()->put('abalo_time', time());
        return redirect()->route('haslogin');
    }

    public function logout(Request $request) {
        $request->session()->flush();
        return redirect()->route('haslogin');
    }


    public function isLoggedIn(Request $request) {
        if($request->session()->has('abalo_user')) {
            $r["user"] = $request->session()->get('abalo_user');
            $r["id"] = $request->session()->get('abalo_user_id');
            $r["time"] = $request->session()->get('abalo_time');
            $r["mail"] = $request->session()->get('abalo_mail');
            $r["auth"] = "true";
        }
        else $r["auth"]="false";
        return response()->json($r); // return response as json object
    }
}
