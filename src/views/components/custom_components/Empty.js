import NoDataIcon from '../../../assets/images/icons/no-data.png'

function Empty(props) {
  return (
    <div>
      <div className="d-flex justify-content-center">
        {!!props.cart ? (
          <>
            <img
              style={{ height: 80 }}
              className="img-fluid"
              src={"/assets/images/empty-cart.png"}
            ></img>
          </>
        ) : (
          <>
            <img
              style={{ height: 80 }}
              className="img-fluid"
              src={NoDataIcon}
            ></img>
          </>
        )}
      </div>
      <h4 style={{ marginTop: 20 }} className="text-center text-muted">
        {props.text ? props.text : "No Data"}
      </h4>
    </div>
  );
}

export default Empty;
