import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { FULL_ORDER_FRAGMENT } from "../../fragments";
import { useHistory } from "react-router-dom";
import { takeOrder, takeOrderVariables } from "../../__generated__/takeOrder";

const COOCKED_ORDERS_SUBSCRIPTION = gql`
  subscription coockedOrders {
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

// const COOCKED_ORDERS_QUERY = gql`
//   query driverGetOrders {
//     getOrders(input: {}) {
//       ok
//       error
//       orders {
//         ...FullOrderParts
//       }
//     }
//   }
//   ${FULL_ORDER_FRAGMENT}
// `;

const TAKE_ORDER_MUTATION = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`;

interface ICoords {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}

const Driver: React.FC<IDriverProps> = () => <div className="text-lg">🚖</div>;

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lng: 0, lat: 0 });
  const [map, setMap] = useState<google.maps.Map>();
  const [maps, setMaps] = useState<any>();

  // @ts-ignore
  const onSucces = ({ coords: { latitude, longitude } }: Position) => {
    setDriverCoords({ lat: latitude, lng: longitude });
  };

  // @ts-ignore
  const onError = (error: PositionError) => {
    console.log(error);
  };

  useEffect(() => {
    navigator.geolocation.watchPosition(onSucces, onError, {
      enableHighAccuracy: true,
    });
  }, []);

  useEffect(() => {
    if (map && maps) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {
          location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
        },
        (results, status) => {
          console.log(status, results);
        }
      );
    }
  }, [driverCoords.lat, driverCoords.lng]);

  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
  };

  const makeRoute = () => {
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions: {
          strokeColor: "#000",
          strokeOpacity: 1,
          strokeWeight: 5,
        },
      });
      directionsRenderer.setMap(map);
      directionsService.route(
        {
          origin: {
            location: new google.maps.LatLng(
              driverCoords.lat,
              driverCoords.lng
            ),
          },
          destination: {
            location: new google.maps.LatLng(
              driverCoords.lat + 0.05,
              driverCoords.lng + 0.05
            ),
          },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result) => {
          directionsRenderer.setDirections(result);
        }
      );
    }
  };

  const { data: coockedOrdersData } = useSubscription(
    COOCKED_ORDERS_SUBSCRIPTION
  );

  // const { data: coockedOrdersData } = useQuery<driverGetOrders>(
  //   COOCKED_ORDERS_QUERY,
  //   { pollInterval: 2000 } // 2초마다 새로고침
  // );

  // 조리 완료된 첫 번째 주문을 가져옵니다
  const cookedOrder = Array.isArray(coockedOrdersData?.cookedOrders)
    ? coockedOrdersData?.cookedOrders[0]
    : coockedOrdersData?.cookedOrders;

  useEffect(() => {
    if (cookedOrder?.id) {
      makeRoute();
    }
  }, [cookedOrder]);

  const history = useHistory();

  const onCompleted = (data: takeOrder) => {
    if (data.takeOrder.ok && cookedOrder) {
      history.push(`/orders/${cookedOrder.id}`);
    }
  };
  const [takeOrderMutation] = useMutation<takeOrder, takeOrderVariables>(
    TAKE_ORDER_MUTATION,
    {
      onCompleted,
    }
  );
  const triggerMutation = (orderId: number) => {
    takeOrderMutation({
      variables: {
        input: {
          id: orderId,
        },
      },
    });
  };

  return (
    <div>
      <div className="overflow-hidden" style={{ height: "70vh" }}>
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          defaultZoom={15}
          draggable={true}
          defaultCenter={{
            lat: 36.58,
            lng: 125.95,
          }}
          bootstrapURLKeys={{
            key: process.env.REACT_APP_GOOGLE_MAP_KEY || "",
          }}
        ></GoogleMapReact>
      </div>

      <div className=" max-w-screen-sm mx-auto bg-white relative -top-16 shadow-lg pt-4 pb-8 px-5">
        {cookedOrder?.restaurant ? (
          <>
            <h1 className="text-center my-3 text-2xl font-semibold">
              {cookedOrder.restaurant?.name}
              로부터
            </h1>

            <h1 className="text-center text-2xl font-medium">
              배달 요청이 들어왔습니다.
            </h1>
            <button
              onClick={() => triggerMutation(cookedOrder.id)}
              className="btn rounded-md w-2/3 ml-24 block  text-center mt-5"
            >
              배달 승인하기 &rarr;
            </button>
          </>
        ) : (
          <h1 className="text-center text-gray-900 text-2xl mt-3 font-medium">
            아직 들어온 배달 요청이 없습니다.
          </h1>
        )}
      </div>
    </div>
  );
};
