import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Loader2, 
  CheckCircle, 
  Truck, 
  MapPin, 
  ExternalLink,
  Check,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const STATUS_CONFIG = {
  Pending: { icon: Clock, bg: 'bg-yellow-100', text: 'text-yellow-700', color: 'yellow' },
  Preparing: { icon: Loader2, bg: 'bg-blue-100', text: 'text-blue-700', color: 'blue' },
  Ready: { icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-700', color: 'green' },
  Delivered: { icon: Truck, bg: 'bg-gray-100', text: 'text-gray-700', color: 'gray' },
};

const STATUS_BUTTONS = [
  { status: 'Pending', color: 'yellow', icon: Clock },
  { status: 'Preparing', color: 'blue', icon: Loader2 },
  { status: 'Ready', color: 'green', icon: CheckCircle },
  { status: 'Delivered', color: 'gray', icon: Truck },
];

const OrderCard = ({ 
  order, 
  urgency, 
  pendingTime, 
  onStatusChange, 
  onAccept, 
  onVerifyPayment 
}) => {
  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className={`border-2 ${
        urgency === 'critical'
          ? 'border-red-300 bg-red-50/30'
          : urgency === 'high'
            ? 'border-orange-200 bg-orange-50/30'
            : 'border-transparent'
      }`}>
        <CardContent className="p-4">
          {/* Timer Badge */}
          {order.status === 'Pending' && (
            <div className="flex justify-end -mt-1 -mr-1 mb-2">
              <Badge variant={
                urgency === 'critical' ? 'destructive' :
                urgency === 'high' ? 'default' : 'secondary'
              } className={urgency === 'critical' ? 'animate-pulse' : ''}>
                <Clock className="w-3 h-3 mr-1" />
                {pendingTime}
              </Badge>
            </div>
          )}

          {/* Order Header */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-bold text-[hsl(var(--foreground))]">
                #{order._id.slice(-6).toUpperCase()}
              </p>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                {order.user?.name} • {order.user?.phone}
              </p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                {order.orderType} • {order.paymentMethod}
              </p>

              {/* Payment Status */}
              <Badge 
                variant={
                  order.paymentStatus === 'Paid' ? 'default' :
                  order.paymentStatus === 'Failed' ? 'destructive' : 'secondary'
                }
                className="mt-1.5"
              >
                {order.paymentStatus === 'Paid' ? (
                  <><Check className="w-3 h-3 mr-1" /> Payment Verified</>
                ) : order.paymentStatus === 'Failed' ? (
                  <><AlertTriangle className="w-3 h-3 mr-1" /> Payment Failed</>
                ) : order.paymentMethod === 'Cash' ? (
                  'Cash on Delivery'
                ) : (
                  <><Clock className="w-3 h-3 mr-1" /> Payment Pending</>
                )}
              </Badge>

              {/* Delivery Address */}
              {order.deliveryAddress && (
                <div className="mt-2 p-2 bg-[hsl(var(--secondary))] rounded-lg text-xs">
                  <p className="font-bold text-[hsl(var(--foreground))] flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Delivery:
                  </p>
                  <p className="text-[hsl(var(--muted-foreground))] mt-1">
                    {order.deliveryAddress.manualAddress || order.deliveryAddress.address || 'Address not captured'}
                  </p>
                  {order.deliveryAddress.coordinates && (
                    <a
                      href={`https://www.google.com/maps?q=${order.deliveryAddress.coordinates.lat},${order.deliveryAddress.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[hsl(var(--primary))] font-bold mt-1.5 inline-flex items-center gap-1"
                    >
                      View on Map <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}
            </div>

            <Badge className={`${config.bg} ${config.text} gap-1`}>
              <StatusIcon className="w-3 h-3" />
              {order.status}
            </Badge>
          </div>

          {/* Order Items */}
          <div className="border-t border-[hsl(var(--border))] pt-3 mb-3 space-y-1">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-[hsl(var(--foreground))]">
                  {item.quantity}× {item.name}
                </span>
                <span className="text-[hsl(var(--muted-foreground))] text-xs">
                  {item.size || ''}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <p className="font-bold text-[hsl(var(--primary))] text-lg mb-3">
            ₹{order.totalAmount?.toFixed(0)}
          </p>

          {/* Cash Payment Verification */}
          {order.paymentMethod === 'Cash' && order.paymentStatus !== 'Paid' && (
            <Button
              variant="outline"
              className="w-full mb-3 border-green-200 text-green-700 hover:bg-green-50"
              onClick={() => onVerifyPayment(order._id)}
            >
              <Check className="w-4 h-4 mr-2" />
              Mark Cash Received
            </Button>
          )}

          {/* Accept Order Button */}
          {order.status === 'Pending' && !order.isAccepted && (
            order.paymentMethod === 'Cash' || order.paymentStatus === 'Paid' ? (
              <Button 
                className="w-full mb-3"
                onClick={() => onAccept(order._id)}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Accept Order
              </Button>
            ) : (
              <div className="w-full mb-3 py-3 bg-yellow-50 border-2 border-yellow-200 text-yellow-700 font-bold rounded-xl flex items-center justify-center gap-2 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Waiting for Payment...
              </div>
            )
          )}

          {/* Status Buttons */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
            {STATUS_BUTTONS.map(({ status, color, icon: Icon }) => (
              <Button
                key={status}
                variant={order.status === status ? 'default' : 'secondary'}
                size="sm"
                disabled={status !== 'Pending' && !order.isAccepted}
                onClick={() => onStatusChange(order._id, status)}
                className={`flex-shrink-0 gap-1.5 ${
                  order.status === status 
                    ? color === 'yellow' ? 'bg-yellow-500 hover:bg-yellow-600' :
                      color === 'blue' ? 'bg-blue-500 hover:bg-blue-600' :
                      color === 'green' ? 'bg-green-500 hover:bg-green-600' :
                      'bg-gray-700 hover:bg-gray-800'
                    : ''
                }`}
              >
                <Icon className="w-3 h-3" />
                {status}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OrderCard;
