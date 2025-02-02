import { RefreshCw } from 'lucide-react';

import useWindowProperties from '@/hooks/useWindowProperty';
import AppLayoutContainer from '@/shared/protected/layout/AppLayoutContainer';
import { Button } from '@/shared/ui/button';
import SvgIcons from '@/icons/SvgIcons';
import OccupancyRatePieChart from '@/shared/protected/dashboard/OccupancyRatePieChart';
import RentalAppFilterAction from '@/shared/protected/dashboard/RentalAppFilterAction';
import RentalAppBarChart from '@/shared/protected/dashboard/RentalAppBarChart';
import OverviewCards from '@/shared/protected/dashboard/OverviewCards';
import useGetRequest from '@/hooks/useGetRequests';
import { DashboardResponseType } from '@/types/DashboardTypes';
import { QueryError } from '@/types/ResponseType';
import { LoadingIconLarge } from '@/shared/global/LoadingIcons';
import ApiError from '@/shared/global/ApiError';
import PRLYLink from '@/shared/global/PRLYLink';

export default function Dashboard() {
  const { width } = useWindowProperties();

  const {
    data, isPending, error, refetch, isFetching,
  } = useGetRequest<DashboardResponseType, QueryError>({
    queryKey: ['dashboard-info'],
    URL: '/dashboard/view',
    isWorkSpace: true,
  });

  return (
    <AppLayoutContainer headerText="Dashboard">
      {
        data
          ? (
            <div className="p-3 md:p-0 flex flex-col gap-[40px] items-start w-full mb-[56px] md:mb-0">
              <div className="overview-cards w-full">
                <div className="flex max-sm:flex-col sm:items-center  self-stretch justify-between w-full mb-4">
                  <h3 className="font-[400] text-[#2a2a2a] text-xl ">Overview</h3>
                  <div className="flex gap-2 xs:items-center max-xs:flex-col max-sm:justify-between max-sm:grow max-sm:my-2">
                    <Button
                      variant="outline"
                      size="lg"
                      disabled={isFetching}
                      onClick={() => { refetch(); }}
                      className="mr-2 px-6 max-sm:w-fit"
                    >
                      <span className={`${isFetching && 'animate-spin duration-1000'} mr-1`}>
                        <RefreshCw className="text-gray-600 scale-[75%]" />
                      </span>
                      <span className="max-sm:hidden">Refresh</span>
                    </Button>
                    <PRLYLink to="/admin/properties/new" isWorkSpace>
                      <Button size="lg">
                        <SvgIcons.Plus className="mr-2 sm:mr-4" />
                        Add New Property
                      </Button>
                    </PRLYLink>
                  </div>
                </div>
                <OverviewCards data={data.data} />
              </div>
              {width > 766
                && (
                  <div className="rental-charts md:flex gap-[24px] w-full self-stretch items-center mb-[56px]">
                    <div className="w-full">
                      <h3 className="font-[400] text-[#2a2a2a] text-[16px] mb-2">Rental Applications</h3>
                      <div className="p-4 flex flex-col gap-[40px] bg-white shadow-[0px_3px_14px_0px_rgba(0,0,0,0.10)] rounded-xl">
                        <div className="flex justify-between">
                          <div className="flex gap-3">
                            <span className="flex">
                              <SvgIcons.Dot className="text-[#D0EDB9] h-2 w-2 mt-[7px] mr-2" />
                              {' '}
                              Reviewed
                            </span>
                            {' '}
                            <span className="flex">
                              <SvgIcons.Dot className="text-[#FEE7D2] h-2 w-2 mt-[7px] mr-2" />
                              {' '}
                              Pending
                            </span>
                          </div>
                          <div className="filterPicker">
                            <RentalAppFilterAction>
                              <Button variant="outline">
                                <SvgIcons.Calendar className="mr-2" />
                                {' '}
                                This Week
                                {' '}
                                <SvgIcons.ChevronDown className="ml-2" />
                                {' '}
                              </Button>
                            </RentalAppFilterAction>
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <RentalAppBarChart
                            data={data.data.attributes.data.rental_apps_in_past_week}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-full">
                      <h3 className="font-[400] text-[#2a2a2a] text-[16px] mb-2">Occupancy Rate</h3>
                      <div
                        className="p-4 flex flex-col gap-[40px] bg-white shadow-[0px_3px_14px_0px_rgba(0,0,0,0.10)] rounded-xl"
                      >
                        <div className="flex gap-3">
                          <span className="flex">
                            <SvgIcons.Dot className="text-[#86EFAC] h-2 w-2 mt-[7px] mr-2" />
                            {' '}
                            Occupied
                          </span>
                          {' '}
                          <span className="flex">
                            <SvgIcons.Dot className="text-[#2B96FF] h-2 w-2 mt-[7px] mr-2" />
                            {' '}
                            Vacant
                          </span>
                        </div>
                        <div className="pieChart flex justify-center">
                          <OccupancyRatePieChart data={data.data.attributes.data.occupancy_rate} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          )
          : null
      }
      <LoadingIconLarge isLoading={isPending} />
      <ApiError error={error} />
    </AppLayoutContainer>
  );
}
