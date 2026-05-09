<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            ProviderSeeder::class,
            PalawanFeeTierSeeder::class,
            CebuanaFeeTierSeeder::class,
            LBCFeeTierSeeder::class,
            GCashPadalaFeeTierSeeder::class,
        ]);

        // Create admin user
        $admin = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@padalahub.com',
        ]);

        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin']);
        $admin->assignRole('admin');
    }
}
