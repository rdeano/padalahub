<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:fetch-international-rates')]
#[Description('Command description')]
class FetchInternationalRates extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
    }
}
