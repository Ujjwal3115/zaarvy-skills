from dataclasses import dataclass, field
from datetime import datetime, timezone
from decimal import Decimal
import logging
from typing import Dict, List, Tuple

logger = logging.getLogger("acme.orders")

@dataclass
class OrderItem:
    sku: str
    quantity: int
    unit_price: Decimal

@dataclass
class Order:
    order_id: str
    customer_id: str
    items: List[OrderItem]
    status: str = "PENDING"
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

class OrderProcessor:
    def __init__(self, tax_rate: Decimal = Decimal("0.0825")) -> None:
        self._tax_rate = tax_rate
        self._processed_orders: Dict[str, Order] = {}

    def calculate_subtotal(self, order: Order) -> Decimal:
        subtotal = Decimal("0.00")
        for item in order.items:
            subtotal += item.unit_price * Decimal(item.quantity)
        return subtotal

    def calculate_tax(self, subtotal: Decimal) -> Decimal:
        return (subtotal * self._tax_rate).quantize(Decimal("0.01"))

    def process_order(self, order: Order) -> Tuple[bool, Decimal, str]:
        if not order.items:
            return False, Decimal("0.00"), "Cannot process order with empty items"
        subtotal = self.calculate_subtotal(order)
        tax = self.calculate_tax(subtotal)
        total = subtotal + tax
        order.status = "PROCESSED"
        self._processed_orders[order.order_id] = order
        return True, total, f"Order {order.order_id} processed successfully"

