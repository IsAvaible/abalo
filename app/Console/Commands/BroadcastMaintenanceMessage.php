<?php

namespace App\Console\Commands;

use App\Events\MaintenanceMessageUpdated;
use Illuminate\Console\Command;

class BroadcastMaintenanceMessage extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'broadcast-maintenance-message {message : The message to broadcast}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Broadcast a maintenance message to all connected users.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Broadcast the maintenance message
        broadcast(new MaintenanceMessageUpdated($this->argument('message')));
    }
}
