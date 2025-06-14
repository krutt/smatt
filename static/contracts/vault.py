#!/usr/bin/env python3.11

### Standard packages ###
from dataclasses import dataclass

### Third-party packages ###
from matt import CCV_FLAG_DEDUCT_OUTPUT_AMOUNT, NUMS_KEY
from matt.argtypes import BytesType, IntType, SignerType
from matt.btctools.script import OP_CHECKCONTRACTVERIFY, OP_CHECKSIG, OP_SWAP, OP_TRUE, CScript
from matt.contracts import ClauseOutput, ClauseOutputAmountBehaviour, OpaqueP2TR, StandardClause, StandardP2TR

### Local modules ###
from .unvaulting import Unvaulting


@dataclass
class Vault(StandardP2TR):
    altenate_pk: None | bytes
    spend_delay: int
    recover_pk: bytes
    unvault_pk: bytes
    has_partial_revault: bool = True
    has_early_recover: bool = True

    def __post_init__(self):
        assert (self.alternate_pk is None or len(self.alternate_pk) == 32) and len(self.recover_pk) == 32 and len(self.unvault_pk) == 32

        unvaulting = Unvaulting(self.alternate_pk, self.spend_delay, self.recover_pk)
        # witness: <sig> <withdrawal_pk> <out_i>
        trigger = StandardClause(
            name="trigger",
            script=CScript([
                # data and index already on the stack
                0 if self.alternate_pk is None else self.alternate_pk,  # pk
                unvaulting.get_taptree_merkle_root(),  # taptree
                0,  # standard flags
                OP_CHECKCONTRACTVERIFY,
                self.unvault_pk,
                OP_CHECKSIG
            ]),
            arg_specs=[
                ('sig', SignerType(self.unvault_pk)),
                ('withdrawal_pk', BytesType()),
                ('out_i', IntType()),
            ],
            next_outputs_fn=lambda args, _: [ClauseOutput(
                n=args['out_i'],
                next_contract=unvaulting,
                next_state=unvaulting.State(withdrawal_pk=args["withdrawal_pk"])
            )]
        )

        # witness: <sig> <withdrawal_pk> <trigger_out_i> <revault_out_i>
        trigger_and_revault = StandardClause(
            name="trigger_and_revault",
            script=CScript([
                0, OP_SWAP,   # no data tweak
                # <revault_out_i> from the witness
                -1,  # current input's internal key
                -1,  # current input's taptweak
                CCV_FLAG_DEDUCT_OUTPUT_AMOUNT,  # revault output
                OP_CHECKCONTRACTVERIFY,

                # data and index already on the stack
                0 if self.alternate_pk is None else self.alternate_pk,  # pk
                unvaulting.get_taptree_merkle_root(),  # taptree
                0,  # standard flags
                OP_CHECKCONTRACTVERIFY,
                self.unvault_pk,
                OP_CHECKSIG
            ]),
            arg_specs=[
                ('sig', SignerType(self.unvault_pk)),
                ('withdrawal_pk', BytesType()),
                ('out_i', IntType()),
                ('revault_out_i', IntType()),
            ],
            next_outputs_fn=lambda args, _: [
                ClauseOutput(n=args['revault_out_i'], next_contract=self,
                             next_amount=ClauseOutputAmountBehaviour.DEDUCT_OUTPUT),
                ClauseOutput(
                    n=args['out_i'],
                    next_contract=unvaulting,
                    next_state=unvaulting.State(withdrawal_pk=args["withdrawal_pk"])),
            ]
        )

        # witness: <out_i>
        recover = StandardClause(
            name="recover",
            script=CScript([
                0,  # data
                OP_SWAP,  # <out_i> (from witness)
                self.recover_pk,  # pk
                0,  # taptree
                0,  # flags
                OP_CHECKCONTRACTVERIFY,
                OP_TRUE
            ]),
            arg_specs=[
                ('out_i', IntType()),
            ],
            next_outputs_fn=lambda args, _: [ClauseOutput(n=args['out_i'], next_contract=OpaqueP2TR(self.recover_pk))]
        )

        if self.has_partial_revault:
            if self.has_early_recover:
                clauses = [trigger, [trigger_and_revault, recover]]
            else:
                clauses = [trigger, trigger_and_revault]
        else:
            if self.has_early_recover:
                clauses = [trigger, recover]
            else:
                clauses = trigger

        super().__init__(NUMS_KEY if self.alternate_pk is None else self.alternate_pk, clauses)


__all__: tuple[str, ...] = ("Vault",)
