#!/usr/bin/env python3.11

### Standard packages ###
from dataclasses import dataclass

### Third-party packages ###
from matt import NUMS_KEY
from matt.argtypes import BytesType, IntType
from matt.btctools.script import OP_CHECKCONTRACTVERIFY, OP_DUP, OP_PICK, OP_SWAP, OP_TRUE, CScript
from matt.contracts import ClauseOutput, OpaqueP2TR, StandardClause, StandardAugmentedP2TR, ContractState
from matt.script_helpers import check_input_contract, older


class Unvaulting(StandardAugmentedP2TR):
    @dataclass
    class State(ContractState):
        withdrawal_pk: bytes

        def encode(self):
            return self.withdrawal_pk

        def encoder_script():
            return CScript([])

    def __init__(self, alternate_pk: None | bytes, spend_delay: int, recover_pk: bytes):
        assert (alternate_pk is None or len(alternate_pk) == 32) and len(recover_pk) == 32

        self.alternate_pk = alternate_pk
        self.spend_delay = spend_delay
        self.recover_pk = recover_pk

        # witness: <withdrawal_pk>
        withdrawal = StandardClause(
            name="withdraw",
            script=CScript([
                OP_DUP,

                *check_input_contract(-1, alternate_pk),

                # Check timelock
                *older(self.spend_delay),

                # Check that the transaction output is as expected
                0,  # no data
                0,  # output index
                2, OP_PICK,  # withdrawal_pk
                0,  # no taptweak
                0,  # default flags
                OP_CHECKCONTRACTVERIFY,

                # withdrawal_pk is left on the stack on success
            ]),
            arg_specs=[
                ('withdrawal_pk', BytesType())
            ],
            next_outputs_fn=lambda args, _: [ClauseOutput(n=0, next_contract=OpaqueP2TR(args['withdrawal_pk']))]
        )

        # witness: <out_i>
        recover = StandardClause(
            name="recover",
            script=CScript([
                0,  # data
                OP_SWAP,  # <out_i> (from witness)
                recover_pk,  # pk
                0,  # taptree
                0,  # flags
                OP_CHECKCONTRACTVERIFY,
                OP_TRUE
            ]),
            arg_specs=[
                ('out_i', IntType()),
            ],
            next_outputs_fn=lambda args, _: [ClauseOutput(n=args['out_i'], next_contract=OpaqueP2TR(recover_pk))]
        )

        super().__init__(NUMS_KEY if alternate_pk is None else alternate_pk, [withdrawal, recover])


__all__: tuple[str, ...] = ("Unvaulting",)
