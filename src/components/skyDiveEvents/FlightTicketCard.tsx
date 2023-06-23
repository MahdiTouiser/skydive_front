import { Ticket } from "../../models/skyDiveEvents.models";
import NumberWithSeperator from "../shared/NumberWithSeperator";
import AddOrRemoveTicket from "../shared/Basket/AddorRemoveTicket";
import { useEffect, useState } from "react";
import { AggregatedTicket } from "../../models/shared.models";
import useBasketTickets from "../../hooks/useBasketTickets";

interface FlightTicketCardProps extends Ticket {
  className?: string;
  flightLoadId: string;
}

const FlightTicketCard: React.FC<FlightTicketCardProps> = (props) => {
  const [aggregatedTicket, setAggreatedTicket] = useState<AggregatedTicket>();
  const { aggregatedTickets, getAggregate } = useBasketTickets();

  useEffect(() => {
    console.log("mg", props.flightLoadId, props.ticketTypeId);
    const aggreated = getAggregate(props.ticketTypeId, props.flightLoadId);
    setAggreatedTicket(
      aggreated ||
        {
          amount: 0,
          flightLoadId: props.flightLoadId,
          flightNumber: 0,
          ticketMembers: [],
          ticketTypeId: props.ticketTypeId,
          type: "",
        }
    );
  }, [aggregatedTickets, props, getAggregate]);
  return (
    <div
      className={`${
        props.className || ""
      } flex flex-col justify-center items-center  font-semibold w-full py-8 text-lg`}
    >
      <p className="mb-1 text-slate-600">بلیت‌ {props.ticketType}</p>
      <p className="mb-5 text-slate-600">
        مبلغ <NumberWithSeperator value={props.amount} /> ریال
      </p>
      <p className="mb-6 text-green-500">بلیت‌های موجود : {props.qty}</p>
      {(aggregatedTicket && aggregatedTickets) && (
        <AddOrRemoveTicket aggretadTicket={aggregatedTicket} />
      )}
    </div>
  );
};

export default FlightTicketCard;
