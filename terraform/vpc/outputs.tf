output "vpc_id" {
  value = "${aws_vpc.vpc.id}"
}

output "public_subnets" {
  value = "${aws_subnet.public_subnets.*.id}"
}

output "private_subnets" {
  value = "${aws_subnet.private_subnets.*.id}"
}

output "igw_id" {
  value = "${aws_internet_gateway.igw.id}"
}

output "public_routes" {
  value = "${aws_route_table.public_route.*.id}"
}

output "private_routes" {
  value = "${aws_route_table.private_route.*.id}"
}

output "vpc_cidr" {
  value = "${var.vpc_cidr}"
}

output "default_security_group_id" {
  value = "${aws_vpc.vpc.default_security_group_id}"
}