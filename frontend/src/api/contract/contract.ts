import addresses from "../addresses.local.json";
import {DNSContract} from "../dns/dns";
import {ethers} from "ethers";

declare var window: any;

export const dnsContract = new DNSContract(addresses.dns);