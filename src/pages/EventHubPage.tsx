import AllEvent from '@/components/ui/EventHub/AllEvent';
import HeaderSection from '@/components/common/HeaderSection'
import { Button } from "../components/ui/button";
import { useState } from 'react';
import { Card, CardContent } from "../components/ui/card";
import CreateEventDialog from '@/components/ui/EventHub/CreateEvent';
import { Plus, Star } from 'lucide-react';

const EventHubPage = () => {

    const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

    return (
        <div className="bg-neutral-50 flex flex-col h-full">
            <HeaderSection />

            <div className="px-4 sm:px-6 py-4 sm:py-6 bg-white border-b border-gray-200 mb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-[20px] sm:text-[24px] lg:text-[28px] text-black">Event Hub</h1>
                        <p className="text-[12px] sm:text-[14px] text-gray-600 mt-1">Plan, execute, and track marketing events and their impact</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="rounded-full border-gray-300 text-sm whitespace-nowrap"
                            onClick={() => import('sonner').then(({ toast }) => toast('Events added by AI is coming soon.'))}
                        >
                            <Star className="w-4 h-4 mr-2" />
                            Events added by AI
                        </Button>
                        <Button
                            className="bg-[#1a2c47] text-white rounded-full px-4 py-2 hover:bg-[#2a3c57] text-sm whitespace-nowrap"
                            onClick={() => setIsCreateEventOpen(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Event
                        </Button>
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-[16px] text-gray-800">Total Events</h3>
                        </div>
                        <p className="text-[36px] text-gray-900 font-semibold tracking-tight">
                            11
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-[16px] text-gray-800">Upcoming</h3>
                        </div>
                        <p className="text-[36px] text-gray-900 font-semibold tracking-tight">
                            8
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-[16px] text-gray-800">Past Events</h3>
                        </div>
                        <p className="text-[36px] text-gray-900 font-semibold tracking-tight">
                            3
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className='mt-4'>
                <AllEvent />
            </div>
                <CreateEventDialog
   open={isCreateEventOpen}
   setOpen={setIsCreateEventOpen}
/>
        </div>
    )
}

export default EventHubPage;
