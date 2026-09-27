"""sync with existing database state

Revision ID: 26f9cce1c1a8
Revises: 22782c4045e9
Create Date: 2026-09-27 00:00:00.000000

This repository was missing the migration revision that already exists in the
shared project database. The database schema is already applied there, so we
mark the chain as synchronized without making a duplicate structural change.
"""

from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "26f9cce1c1a8"
down_revision: Union[str, Sequence[str], None] = "22782c4045e9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema to the currently deployed state."""
    # This database already contains the schema for the current shared deployment.
    # We intentionally keep this migration as a compatibility marker so the
    # repository and live database can agree on the Alembic revision chain.
    op.execute("SELECT 1")


def downgrade() -> None:
    """Downgrade schema is intentionally not implemented for this compatibility marker."""
    pass
