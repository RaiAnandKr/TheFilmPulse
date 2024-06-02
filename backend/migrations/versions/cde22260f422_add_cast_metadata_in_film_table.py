"""Add cast_metadata in Film table

Revision ID: cde22260f422
Revises: eee43b6f9555
Create Date: 2024-06-02 10:13:48.206682

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'cde22260f422'
down_revision = 'eee43b6f9555'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('film', schema=None) as batch_op:
        batch_op.add_column(sa.Column('cast_metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('film', schema=None) as batch_op:
        batch_op.drop_column('cast_metadata')

    # ### end Alembic commands ###